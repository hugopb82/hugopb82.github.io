const audioContext = new (window.AudioContext || window.webkitAudioContext)()

async function handleFiles(files) {

	const arrayBuffer = await files[0].arrayBuffer()
	const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
	let data = audioBuffer.getChannelData(0).slice(10000, 10000 + 100)
	console.log(data)
	draw(data)
	
}

const dpi 		= window.devicePixelRatio
const WIDTH 	= 500
const HEIGHT 	= 200
const canvas 	= document.querySelector('#waveform_visualizer')
const ctx 		= canvas.getContext('2d')

canvas.style.width = WIDTH + 'px'
canvas.style.height = HEIGHT + 'px'
canvas.width 	= WIDTH * dpi
canvas.height 	= HEIGHT * dpi
ctx.scale(dpi, dpi)

function draw(data) {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'rgb(0, 0, 0)';
	// ctx.beginPath();
	for(var i = 0; i < data.length; i++) {
		var x = i*5
		var y = data[i] * 100000 + HEIGHT / 2 + 0.5;

		// if(i === 0) {
		// 	ctx.moveTo(x, y);
		// } else {
		// 	ctx.lineTo(x, y);
		// }
		
		ctx.beginPath();
		ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
		ctx.fill();
	}

	// for (let i = 0; i < data.length - 1; i++) {
	// 	var x_mid =  (2*i + 1) / 2 * 5;
	// 	var y_mid = (data[i] + data[i+1]) * 100000 / 2 + HEIGHT / 2;
	// 	var cp_x1 = (x_mid + i*5) / 2;
	// 	var cp_x2 = (x_mid + (i+1)*5) / 2;
	// 	ctx.quadraticCurveTo(cp_x1,data[i] * 100000+ HEIGHT / 2, x_mid, y_mid);
	// 	ctx.quadraticCurveTo(cp_x2,data[i+1] * 100000 + HEIGHT / 2, (i+1)*5, data[i+1]* 100000 + HEIGHT / 2);
	// }
	ctx.lineTo(canvas.width, canvas.height/2);
	ctx.stroke();
}