import {get_module_path} from '../utils.js'

const MODULE_PATH = get_module_path(import.meta.url)

const audioContext = new (window.AudioContext || window.webkitAudioContext)()

class WaveformVisualizer extends HTMLElement {
	constructor() {
		super()
		let shadow = this.attachShadow({mode: 'open'})
		
		let input = document.createElement('input')
		input.setAttribute('type', 'file')
		input.setAttribute('accept', 'audio/*')
		input.setAttribute('id', 'file_input')

		let label = document.createElement('label')
		label.setAttribute('for', 'file_input')
		label.textContent = "Upload file"
		this.label = label
		
		this.boundhandleFileChange = this.handleFileChange.bind(this)
		input.addEventListener('change', this.boundhandleFileChange)

		let canvas = document.createElement('canvas')
		this.canvas = canvas
		this.ctx = this.canvas.getContext('2d')

		let style = document.createElement('link');
		style.setAttribute('rel', 'stylesheet');
		style.setAttribute('href', `${MODULE_PATH}/waveform_visualizer.css`);
		
		shadow.appendChild(input)
		shadow.appendChild(label)
		shadow.appendChild(canvas)
		shadow.appendChild(style)

	}

	connectedCallback() {
		
	}

	async handleFileChange(e) {
		this.label.style.opacity = 0

		const arrayBuffer = await e.target.files[0].arrayBuffer()
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
		let data = audioBuffer.getChannelData(0)
		data = data.slice(10000, 10000 + 1000)
		this.draw(data)
	}

	draw(data) {
		const WIDTH 	= this.canvas.offsetWidth
		const HEIGHT 	= this.canvas.offsetHeight
		const dpi 		= window.devicePixelRatio

		this.canvas.width 	= WIDTH * dpi
		this.canvas.height 	= HEIGHT * dpi
		this.ctx.scale(dpi, dpi)

		// this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

		this.ctx.fillStyle = "white";
		for(var i = 0; i < data.length; i++) {
			var x = i*10
			var y = data[i] * 100000 + 100 / 2 + 0.5;
			// var y = 40 * Math.sin(x / 40) + 100 /2
			
			this.ctx.beginPath();
			this.ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
			this.ctx.fill();
		}
	}
}

customElements.define('waveform-visualizer', WaveformVisualizer);