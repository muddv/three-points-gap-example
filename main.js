import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	MeshBasicMaterial,
	BufferGeometry,
	Vector3,
	Points,
} from 'three'
import { useMode, modeLch } from 'culori'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

let scene, camera, renderer, controls

function init() {
	scene = new Scene()
	camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
	renderer = new WebGLRenderer({ canvas: document.querySelector('#canvas') })

	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)
	camera.position.setZ(1)
	camera.position.setY(1)
	camera.position.setX(2)
}

function getModelData() {
	let coordinates = []
	let colors = []
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
	return { coordinates, colors }
}

function generateModel() {
	const modelData = getModelData()
	const geometry = new BufferGeometry().setFromPoints(modelData.coordinates)
	const material = new MeshBasicMaterial()
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
	generateModel()
	animate()
}

drawFigure()

