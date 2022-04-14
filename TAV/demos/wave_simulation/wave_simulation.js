import {get_module_path} from '../utils.js'

const MODULE_PATH = get_module_path(import.meta.url)

class WaveSimulation extends HTMLElement {

	points = []

	constructor() {
		super()
		
		let shadow 	= this.attachShadow({mode: 'open'})

		this.canvas = document.createElement('canvas')
		this.ctx 	= this.canvas.getContext('2d')

		let style = document.createElement('link');
		style.setAttribute('rel', 'stylesheet');
		style.setAttribute('href', `${MODULE_PATH}/wave_simulation.css`);

		shadow.appendChild(this.canvas)
		shadow.appendChild(style)
	}

	connectedCallback() {
		setTimeout(() => {
			this.init()
			this.update()
		})
	}

	init() {
		const WIDTH 	= this.canvas.offsetWidth
		const HEIGHT 	= this.canvas.offsetHeight
		const dpi 		= window.devicePixelRatio

		// this.canvas.style.width 	= WIDTH + 'px'
		// this.canvas.style.height 	= HEIGHT + 'px'
		this.canvas.width 	= WIDTH * dpi
		this.canvas.height 	= HEIGHT * dpi
		this.ctx.scale(dpi, dpi)

		for (let x = 0; x < 100; x++) {
			for (let y = 0; y < 10; y++) {
				x += Math.random()/5
				y += Math.random()/5
				this.points.push({x:x, x0:x, y:y, y0:y})
			}
		}
	}

	update(t) {
		t /= 1000
		var A = 2
		var k = 2 * Math.PI / 10
		var omega = 2 * Math.PI / 10
		this.points.forEach(point => {
			point.x = point.x0 + A * Math.sin(k * point.x0 - omega * t)
		})
		this.draw()
		window.requestAnimationFrame((t) => this.update(t))
	}

	draw(t) {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		let amp = 20
		this.ctx.fillStyle = "white";
		this.ctx.translate(50, 0)
		this.ctx.fillRect(this.points[0].x * amp, 0, 10, 100)
		this.points.forEach(point => {
			this.ctx.beginPath();
			this.ctx.arc(point.x * amp + 50, point.y * amp, 3, 0, 2 * Math.PI);
			this.ctx.fill();
		})
		this.ctx.translate(-50, 0)
	}

}

customElements.define('wave-simulation', WaveSimulation)