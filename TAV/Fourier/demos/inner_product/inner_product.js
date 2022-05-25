import {get_module_path} from '../utils.js'
const MODULE_PATH = get_module_path(import.meta.url)

class InnerProduct extends HTMLElement {

	k = 0
	N = 16
	m = 20

	constructor() {
		super()

		let shadow 	= this.attachShadow({mode: 'open'})

		this.canvas = document.createElement('canvas')
		this.canvas.style.width = '500px'
		this.canvas.style.height = '300px'
		this.ctx 	= this.canvas.getContext('2d')

		this.similarity = document.createElement('div')
		this.similarity.setAttribute('id', 'similarity')

		this.range = document.createElement('input')
		this.range.setAttribute('type', 'range')
		this.range.setAttribute('min', '0')
		this.range.setAttribute('max', this.N / 2)
		this.range.setAttribute('step', '1')

		this.range.addEventListener('change', () => {
			this.k = this.range.value
			this.draw()
		})

		let style = document.createElement('link');
		style.setAttribute('rel', 'stylesheet');
		style.setAttribute('href', `${MODULE_PATH}/style.css`);

		shadow.appendChild(this.canvas)
		shadow.appendChild(this.similarity)
		shadow.appendChild(this.range)
		shadow.appendChild(style)
	}

	connectedCallback() {
		setTimeout(() => {
			this.init()
			this.draw()
		})
	}

	init() {
		this.WIDTH 		= this.canvas.offsetWidth
		this.HEIGHT 	= this.canvas.offsetHeight
		const dpi 		= window.devicePixelRatio

		this.canvas.width 	= this.WIDTH * dpi
		this.canvas.height 	= this.HEIGHT * dpi
		// this.ctx.scale(dpi, dpi)

		this.ctx.translate(0, this.canvas.height / 2);
		this.ctx.scale(dpi, -dpi);
		
		let cos = (f, t) => Math.cos(2 * Math.PI * f * t)
		this.basis_cos = Array.from(Array(this.N), (v, k) => {
			return Array.from(Array(this.N), (v, n) => {
				return cos(k / this.N, n)
			})
		})
		this.basis_cos_e = Array.from(Array(this.N * this.m), (v, k) => {
			return Array.from(Array(this.N * this.m), (v, n) => {
				return cos(k / this.N, n / this.m)
			})
		})

		let fun = (t) => 0.5 * (
			Math.cos(2 * Math.PI * 1 / this.N * t) +
			Math.cos(2 * Math.PI * 3 / this.N * t)
		)
		this.fun = Array.from(Array(this.N), (v, n) => {
			return fun(n)
		})
		this.fun_e = Array.from(Array(this.N * this.m), (v, n) => {
			return fun(n / this.m)
		})
	}

	draw() {
		this.ctx.clearRect(0, -this.canvas.height/2, this.canvas.width, this.canvas.height)

		this.basis_cos_e[this.k].forEach((v, n) => {
			let x = n / (this.N * this.m) * this.WIDTH 
			// let y = this.HEIGHT - (v + 1) / 2 * (this.HEIGHT - 5)
			let y = v * this.HEIGHT / 3

			this.ctx.beginPath()
			this.ctx.fillStyle = "rgba(255,255,255,.3)"
			this.ctx.arc(x, y, 2, 0, 2 * Math.PI)
			this.ctx.fill()
		})

		this.basis_cos[this.k].forEach((v, n) => {
			let x = n / this.N * this.WIDTH 
			// let y = this.HEIGHT - (v + 1) / 2 * (this.HEIGHT - 5)
			let y = v * this.HEIGHT / 3

			this.ctx.beginPath()
			this.ctx.fillStyle = "white"
			this.ctx.arc(x, y, 4, 0, 2 * Math.PI)
			this.ctx.fill()
		})

		this.fun_e.forEach((v, n) => {
			let x = n / (this.N * this.m) * this.WIDTH 
			// let y = this.HEIGHT - (v + 1) / 2 * (this.HEIGHT - 5)
			let y = v * this.HEIGHT / 3

			this.ctx.beginPath()
			this.ctx.fillStyle = "rgba(255,0,0,.5)"
			this.ctx.arc(x, y, 2, 0, 2 * Math.PI)
			this.ctx.fill()
		})

		this.fun.forEach((v, n) => {
			let x = n / this.N * this.WIDTH 
			// let y = this.HEIGHT - (v + 1) / 2 * (this.HEIGHT - 5)
			let y = v * this.HEIGHT / 3

			this.ctx.beginPath()
			this.ctx.fillStyle = "rgba(255, 0, 0, 0.9)"
			this.ctx.arc(x, y, 4, 0, 2 * Math.PI)
			this.ctx.fill()
		})

		this.similarity.style.width = Math.abs(this.inner_product(this.basis_cos[this.k], this.fun)) / 4 * 300 + 'px'
	}

	inner_product(x, y) {
		let sum = 0
		x.forEach((v, i) => {
			sum += x[i] * y[i]
		})
		return sum
	}

}

customElements.define('inner-product', InnerProduct)