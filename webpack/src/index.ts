// add styles
import './style.css'
// three.js
import * as THREE from 'three'
import { Planet } from './planet'
import { Vector3, MeshPhongMaterial, MeshBasicMaterial, MeshStandardMaterial } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
 
const gui = new dat.GUI();
// create the scene
let scene = new THREE.Scene()

const textureSources = [
	{
		source:"textures/mercury.jpg",
		orbitalVelocity: 1.607
	}, {
		source:"textures/venus.jpg",
		orbitalVelocity: 1.174
	}, {
		source:"textures/earth.jpg",
		orbitalVelocity: 1
	}, {
		source:"textures/mars.jpg",
		orbitalVelocity: 	0.802
	}, {
		source:"textures/jupiter.jpg",
		orbitalVelocity: 0.434
	}, {
		source:"textures/saturn.jpg",
		orbitalVelocity: 0.323
	}, {
		source:"textures/venus.jpg",
		orbitalVelocity: 0.228
	}, {
		source:"textures/venus.jpg",
		orbitalVelocity: 0.182
	}
]


const sunRadius = 1;
const planets = textureSources.map((src,i) => {
		const map = new THREE.TextureLoader().load( src.source );
		map.wrapS = THREE.RepeatWrapping;
		map.wrapT = THREE.RepeatWrapping;
		map.repeat.set( 1, 1 );
		return new Planet(sunRadius + (i+1)*1.5,.1*(i+1), 0,0.01*src.orbitalVelocity,0.01,new Vector3(0,0,0), new MeshStandardMaterial({map}));});


const moon = new Planet(.5,.1,0,.001,.001,new Vector3(0,0,0),planets[2].material)
planets[2].addMoon(moon)

for (let i = 0; i < 100; i++) {
	const moon = new Planet(1.1,.05,.01,.01*(i+1),.001,new Vector3(0,0,0),planets[5].material)
	planets[5].addMoon(moon)
	
}

for (let i = 0; i < 100; i++) {
	const moon = new Planet(.9,.05,.01, .01*(i+1),.001,new Vector3(0,0,0),planets[5].material)
	planets[5].addMoon(moon)
	
}

// create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// set size
renderer.setSize(window.innerWidth, window.innerHeight)

// add canvas to dom
document.body.appendChild(renderer.domElement)

// add axis to the scene
let axis = new THREE.AxesHelper(10)

scene.add(axis)

const sunLight = new THREE.PointLight( 0xffffff, 5, 50 );
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024; // default
sunLight.shadow.mapSize.height = 1024; // default
sunLight.shadow.camera.near = 1; // default
sunLight.shadow.camera.far = 1000 // default
sunLight.shadow.radius = 10
const sun = new Planet(0,sunRadius,0,.001,.001,new Vector3(0,0,0),new MeshBasicMaterial({map:new THREE.TextureLoader().load( "textures/sun.jpg" )}))
sunLight.add(sun)
scene.add(sunLight)
const ambient = new THREE.AmbientLight( 0x404040 ); // soft white light

scene.add( ambient );

var helper = new THREE.CameraHelper( sunLight.shadow.camera );
scene.add( helper );
planets.push(sun)

//scene.add(box)

planets.forEach(planet => scene.add(planet))
//This will add a starfield to the background of a scene
var starsGeometry = new THREE.Geometry();

for ( var i = 0; i < 10000; i ++ ) {

	var star = new THREE.Vector3();
	star.x = THREE.Math.randFloatSpread( 2000 );
	star.y = THREE.Math.randFloatSpread( 2000 );
	star.z = THREE.Math.randFloatSpread( 2000 );

	starsGeometry.vertices.push( star );

}

var starsMaterial = new THREE.PointsMaterial( { color: 0x888888 } );

var starField = new THREE.Points( starsGeometry, starsMaterial );

scene.add( starField );


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
