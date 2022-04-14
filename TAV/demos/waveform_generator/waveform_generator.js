import {get_module_path} from '../utils.js'

const MODULE_PATH = get_module_path(import.meta.url)
const audioContext = new (window.AudioContext || window.webkitAudioContext)()

class WaveformGenerator extends HTMLElement {

	isPlaying = false

	constructor() {
		super()

		this.oscillator = audioContext.createOscillator()
		this.analyser = audioContext.createAnalyser()

		this.oscillator.connect(this.analyser)
		this.analyser.connect(audioContext.destination)

		this.oscillator.start(0)
		audioContext.suspend()

		let shadow = this.attachShadow({mode: 'open'})
		this.shadow = shadow

		this.canvas = document.createElement('canvas')
		this.ctx = this.canvas.getContext('2d')

		this.playBtn = document.createElement('button')
		this.playBtn.innerText = "Play"
		this.playBtn.addEventListener('click', (e) => {
			this.toggle()
		})

		this.freqRange = document.createElement('input')
		this.freqRange.setAttribute('type', 'range')
		this.freqRange.setAttribute('min', '200')
		this.freqRange.setAttribute('max', '800')
		this.freqRange.setAttribute('value', '440')
		this.freqRange.addEventListener('input', (e) => {
			this.update()
		})

		this.sineBtn = document.createElement('input')
		this.sineBtn.setAttribute('type', 'radio')
		this.sineBtn.setAttribute('value', 'sine')
		this.sineBtn.setAttribute('name', 'type')

		this.sineBtn = document.createElement('input')
		this.sineBtn.setAttribute('type', 'radio')
		this.sineBtn.setAttribute('value', 'sine')
		this.sineBtn.setAttribute('checked', 'true')
		this.sineBtn.setAttribute('name', 'type')
		this.sineBtn.addEventListener('click', () => this.update())

		this.squareBtn = document.createElement('input')
		this.squareBtn.setAttribute('type', 'radio')
		this.squareBtn.setAttribute('value', 'square')
		this.squareBtn.setAttribute('name', 'type')
		this.squareBtn.addEventListener('click', () => this.update())

		let style = document.createElement('link');
		style.setAttribute('rel', 'stylesheet');
		style.setAttribute('href', `${MODULE_PATH}/style.css`);

		shadow.appendChild(style)
		shadow.appendChild(this.canvas)
		shadow.appendChild(this.playBtn)
		shadow.appendChild(this.freqRange)
		shadow.appendChild(this.sineBtn)
		shadow.appendChild(this.squareBtn)
	}

	connectedCallback() {
		setTimeout(() => {
			this.initCanvas()
		})
	}

	update() {
		this.oscillator.frequency.value = this.freqRange.value
		this.oscillator.type = this.shadow.querySelector('input[name="type"]:checked').value
	}

	toggle() {
		(this.isPlaying ? this.stop() : this.play())
		this.isPlaying = !this.isPlaying
	}

	play() {
		audioContext.resume()
		this.playBtn.innerText = "Stop"
		this.animation = window.requestAnimationFrame(this.draw.bind(this))
	}

	stop() {
		audioContext.suspend()
		this.playBtn.innerText = "Play"
		window.cancelAnimationFrame(this.animation)
	}

	initCanvas() {
		this.WIDTH 	= this.canvas.offsetWidth
		this.HEIGHT 	= this.canvas.offsetHeight
		const dpi 		= window.devicePixelRatio

		this.canvas.width 	= this.WIDTH * dpi
		this.canvas.height 	= this.HEIGHT * dpi
		this.ctx.scale(dpi, dpi)

		this.color = getComputedStyle(this).getPropertyValue('--color')

	}

	draw() {
		let dataArray = new Uint8Array(this.analyser.frequencyBinCount)
		this.analyser.getByteTimeDomainData(dataArray)

		this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT)
		this.ctx.fillStyle = this.color;

		for (let i = 0; i < dataArray.length; i++) {
			var v = dataArray[i] / 256.0 * this.HEIGHT
			var x = i * this.WIDTH / dataArray.length
			var y = this.HEIGHT - v - 1
			this.ctx.beginPath();
			this.ctx.arc(x, y, 1, 0, 2 * Math.PI);
			this.ctx.fill();
		}

		this.animation = window.requestAnimationFrame(this.draw.bind(this))
	}

}

customElements.define('waveform-generator', WaveformGenerator)