// add styles
import './style.css'
// three.js
import * as THREE from 'three'
import { Planet } from './planet'
import { Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// create the scene
let scene = new THREE.Scene()


const textureSources = [
	{
		source:"textures/mercury.jpg",
		orbitalVelocity: .01
	}, {
		source:"textures/venus.jpg",
		orbitalVelocity: .02
	}, {
		source:"textures/earth.jpg",
		orbitalVelocity: .03
	}, {
		source:"textures/mars.jpg",
		orbitalVelocity: .02
	}, {
		source:"textures/jupiter.jpg",
		orbitalVelocity: .001
	}, {
		source:"textures/saturn.jpg",
		orbitalVelocity: .025
	}, {
		source:"textures/venus.jpg",
		orbitalVelocity: .002
	}, {
		source:"textures/venus.jpg",
		orbitalVelocity: .07
	}
]

const planets = textureSources.map((src,i) => {
		const texture = new THREE.TextureLoader().load( src.source );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1 );
		return new Planet((i+1)*1,.3,src.orbitalVelocity,0.01,new Vector3(0,0,0), texture, true);});



// create the camera
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

let renderer = new THREE.WebGLRenderer()

// set size
renderer.setSize(window.innerWidth, window.innerHeight)

// add canvas to dom
document.body.appendChild(renderer.domElement)

// add axis to the scene
let axis = new THREE.AxesHelper(10)

scene.add(axis)

const sunLight = new THREE.PointLight( 0xffffff, 5, 50 );

const sun = new Planet(0,1,.01,.01,new Vector3(0,0,0),new THREE.TextureLoader().load( "textures/sun.jpg" ),false)
sunLight.add(sun)
scene.add(sunLight)

planets.push(sun)

//scene.add(box)

planets.forEach(planet => scene.add(planet))


camera.position.x = 5
camera.position.y = 5
camera.position.z = 5

camera.lookAt(scene.position)

const controls = new OrbitControls (camera, renderer.domElement);
			controls.maxPolarAngle = Math.PI / 2;

function animate(): void {
	requestAnimationFrame(animate)
	render()
}

function render(): void {
	let timer = 0.002 * Date.now()
	planets.forEach(p => p.tick())
	renderer.render(scene, camera)
}


animate()
