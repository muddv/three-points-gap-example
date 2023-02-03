import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	MeshBasicMaterial,
	BufferAttribute,
	BufferGeometry,
	Vector3,
	Cylindrical,
	Points
} from 'three'
import { useMode, modeLch, modeOklch } from 'culori'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

let scene, camera, renderer, controls

function init() {
	scene = new Scene()
	camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
	renderer = new WebGLRenderer({ canvas: document.querySelector('#canvas') })

	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)
	camera.position.setZ(590)
	camera.position.setY(90)
	camera.position.setX(90)
}

function getModelData(space) {
	let coordinates = []
	let colors = []
	if (space === 'oklab') {
		let lch = useMode(modeLch)
		for (let x = 0; x <= 1; x += 0.01) {
			for (let y = 0; y <= 1; y += 0.01) {
				for (let z = 0; z <= 1; z += 0.01) {
					let rgb = { mode: 'rgb', r: x, g: y, b: z }
					let color = lch(rgb)
					if (color.l && color.c && color.h) {
						coordinates.push(new Vector3(color.l, color.c, color.h))
						colors.push(rgb.r, rgb.g, rgb.b)
					}
				}
			}
		}
	}
	else if (space === 'srgb') {
		let lch = useMode(modeLch)
		for (let x = 0; x <= 1; x += 0.01) {
			for (let y = 0; y <= 1; y += 0.01) {
				for (let z = 0; z <= 1; z += 0.01) {
					let rgb = { mode: 'rgb', r: x, g: y, b: z }
					let color = lch(rgb)
					if (color.l && color.c && color.h) {
						coordinates.push(new Vector3(rgb.r, rgb.g, rgb.b))
						colors.push(rgb.r, rgb.g, rgb.b)
					}
				}
			}
		}
	}
	else if (space === 'oklch') {
		let oklch = useMode(modeOklch)
		for (let x = 0; x <= 1; x += 0.01) {
			for (let y = 0; y <= 1; y += 0.01) {
				for (let z = 0; z <= 1; z += 0.01) {
					let rgb = { mode: 'rgb', r: x, g: y, b: z }
					let color = oklch(rgb)
					if (color.l && color.c && color.h) {
						coordinates.push(new Cylindrical(color.l, color.c, color.h))
						colors.push(rgb.r, rgb.g, rgb.b)
					}
				}
			}
		}
	}

	return { space: space, coordinates, colors }
}

function srgbInOklab() {
	const modelData = getModelData('oklab')
	const geometry = new BufferGeometry().setFromPoints(modelData.coordinates)
	const color = new Float32Array(modelData.colors)
	geometry.setAttribute('color', new BufferAttribute(color, 3))
	const material = new MeshBasicMaterial({ vertexColors: true })
	const points = new Points(geometry, material)
	controls = new TrackballControls(camera, renderer.domElement)
	scene.add(points)
}

function srgbInSrgb() {
	const modelData = getModelData('srgb')
	const geometry = new BufferGeometry().setFromPoints(modelData.coordinates)
	const color = new Float32Array(modelData.colors)
	geometry.setAttribute('color', new BufferAttribute(color, 3))
	const material = new MeshBasicMaterial({ vertexColors: true })
	const points = new Points(geometry, material)
	controls = new TrackballControls(camera, renderer.domElement)
	scene.add(points)
}

function srgbInOklch() {
	const modelData = getModelData('oklch')
	let positions = []
	for (let i in modelData.coordinates) {
		let coordinates = modelData.coordinates[i]
		let x = coordinates.radius * Math.sin(coordinates.y) * Math.cos(coordinates.theta)
		let y = coordinates.radius * Math.sin(coordinates.y) * Math.sin(coordinates.theta)
		let z = coordinates.radius * Math.cos(coordinates.y)
		positions.push(new Vector3(x, y, z))
	}
	const geometry = new BufferGeometry().setFromPoints(positions)
	const color = new Float32Array(modelData.colors)
	geometry.setAttribute('color', new BufferAttribute(color, 3))
	const material = new MeshBasicMaterial({ vertexColors: true })
	const points = new Points(geometry, material)
	controls = new TrackballControls(camera, renderer.domElement)
	scene.add(points)
}

function animate() {
	requestAnimationFrame(animate)
	controls.update()
	renderer.render(scene, camera)
}

function drawFigure() {
	init()
	//srgbInSrgb()
	srgbInOklab()
	//srgbInOklch()
	animate()
}

drawFigure()

