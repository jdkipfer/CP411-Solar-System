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
const textureManager = new THREE.LoadingManager();

const textureSources = [
	{
		name: "mercury",
		source: "textures/mercury.jpg",
		orbitalVelocity: 1.607,
		wikipedia:"Mercury_(planet)",
		diameter:0.383,
		orbitDistance:0.387	
	}, {
		name: "venus",
		source: "textures/venus.jpg",
		orbitalVelocity: 1.174,
		wikipedia:"Venus",
		diameter:0.949	,
		orbitDistance:0.723	
	}, {
		name: "earth",
		source: "textures/earth.jpg",
		orbitalVelocity: 1,
		wikipedia:"Earth",
		diameter:1	,
		orbitDistance:1	
	}, {
		name: "mars",
		source: "textures/mars.jpg",
		orbitalVelocity: 0.802,
		wikipedia:"Mars",
		diameter:0.532	,
		orbitDistance:1.52	
	}, {
		name: "jupiter",
		source: "textures/jupiter.jpg",
		orbitalVelocity: 0.434,
		wikipedia:"Jupiter",
		diameter:11.21	,
		orbitDistance:5.20	
	}, {
		name: "saturn",
		source: "textures/saturn.jpg",
		orbitalVelocity: 0.323,
		wikipedia:"Saturn",
		diameter:9.45	,
		orbitDistance:9.58	
	}, {
		name: "uranus",
		source: "textures/venus.jpg",
		orbitalVelocity: 0.228,
		wikipedia:"Uranus",
		diameter:4.01	,
		orbitDistance:19.20	
	}, {
		name: "neptune",
		source: "textures/venus.jpg",
		orbitalVelocity: 0.182,
		wikipedia:"Neptune",
		diameter:3.88,
		orbitDistance:30.05
	}
]

const getExtract = async (name: string) => {
	const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&list=&indexpageids=1&titles=${name}&exintro=1&explaintext=1&exsectionformat=plain&origin=*&exsentences=5`
	console.log(url)
	const resp : {
		batchcomplete:string,
		query:{
			normalized:{"from":string,"to":string}[],
			pageids:number[]
			pages:{
				[key : string]:{
					pageid:typeof key,
					ns:number,
					title:string,
					extract:string
				}
			}
		}
	} = await fetch(url).then(r => r.json());
	return resp
}
const sunRadius = 1;
const textureLoader = new THREE.TextureLoader(textureManager)
let texturesStarted = 0;
let texturesLoaded = 0;

const loadTexture = (src : string) => {
	texturesStarted++;
	const map = textureLoader.load(src, () => texturesLoaded++);
	map.wrapS = THREE.RepeatWrapping;
	map.wrapT = THREE.RepeatWrapping;
	map.repeat.set(1, 1);
	return map
}
let distanceScale = 10;
let diameterScale = .5;
const planets = textureSources.map((src, i) => {
	return new Planet(
		src.name, 
		src.wikipedia, 
		src.orbitDistance*distanceScale, 
		src.diameter*diameterScale, 
		0, 
		src.orbitalVelocity*1/distanceScale, 
		0.01, 
		new Vector3(0, 0, 0), 
		new MeshStandardMaterial({ map:loadTexture(src.source) }));
});



const moon = new Planet("earth moon","Moon", .5, .1, 0, 1/12, .001, new Vector3(0, 0, 0), new MeshStandardMaterial({ map:loadTexture("textures/moon.jpg") }))
planets[2].addMoon(moon)

const n = 7;

for (let j = 0; j < 7; j++) {
	for (let i = 0; i < 100; i++) {
		const moon = new Planet(`saturn moon ${j},${i} `,"Rings_of_Saturn", 0.9 + 0.5 * (j / n), .01, THREE.Math.degToRad(27), .1 * (i + 1), 0, new Vector3(0, 0, 0), planets[5].material)
		planets[5].addMoon(moon)
	}
}

// create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// set size
renderer.setSize(window.innerWidth, window.innerHeight)

const textBox = document.getElementById("textbox") as HTMLDivElement
const moreInfo = document.getElementById("moreinfo") as HTMLAnchorElement
// add canvas to dom
document.body.appendChild(renderer.domElement)

let containerWidth = document.body.clientWidth
let containerHeight = document.body.clientHeight

// add axis to the scene
let axis = new THREE.AxesHelper(10)

//scene.add(axis)

const sunLight = new THREE.PointLight(0xffffff, 5, 50);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024; // default
sunLight.shadow.mapSize.height = 1024; // default
sunLight.shadow.camera.near = 1; // default
sunLight.shadow.camera.far = 1000 // default
sunLight.shadow.radius = 10
const sun = new Planet("sun","Sun", 0, sunRadius, 0, .001, .001, new Vector3(0, 0, 0), new MeshBasicMaterial({ map: loadTexture("textures/sun.jpg") }))
sunLight.add(sun)
scene.add(sunLight)
const ambient = new THREE.AmbientLight(0x404040); // soft white light

scene.add(ambient);

planets.push(sun)

//scene.add(box)

planets.forEach(planet => scene.add(planet))
//This will add a starfield to the background of a scene
var starsGeometry = new THREE.Geometry();

for (var i = 0; i < 10000; i++) {

	var star = new THREE.Vector3();
	star.x = 100 + THREE.Math.randFloatSpread(2000);
	star.y = 100 + THREE.Math.randFloatSpread(2000);
	star.z = 100 + THREE.Math.randFloatSpread(2000);

	starsGeometry.vertices.push(star);

}

var starsMaterial = new THREE.PointsMaterial({ color: 0x888888 });

var starField = new THREE.Points(starsGeometry, starsMaterial);

scene.add(starField);


camera.position.x = 0
camera.position.y = 10
camera.position.z = 0

camera.lookAt(scene.position)

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;
controls.enablePan = false;
controls.enableZoom = false;

function animate(): void {
	requestAnimationFrame(animate)
	if (texturesLoaded == texturesStarted) render()
}

const options = {
	speed: 2,
	ambient: 1,
	sun: 5
}


const getCurr = () => options.speed * 0.001 * Date.now()

let prevFrame = getCurr()

gui.add(options, 'speed', 1, 100).onChange(val => {
	options.speed = val
	prevFrame = getCurr()
})
gui.add(options, 'ambient', 0, 5).onChange(val => {
	ambient.intensity = val
})
gui.add(options, 'sun', 0, 5).onChange(val => {
	sunLight.intensity = val
})
const camOffset = 10;
const direction = new THREE.Vector3();
let currentObject : THREE.Object3D = sun.mesh;

function render(): void {
	
	currentObject.getWorldPosition( controls.target );
	controls.update();
	
	// update the transformation of the camera so it has an offset position to the current target
	
	direction.subVectors( camera.position, controls.target );
	direction.normalize().multiplyScalar( camOffset );
	camera.position.copy( direction.add( controls.target ) );
	const curr = getCurr()
	const timer = curr - prevFrame;
	prevFrame = curr;
	planets.forEach(p => p.tick(timer))
	renderer.render(scene, camera)
}
textureManager.onLoad = function () {
	animate()
};
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('resize', onWindowResize, false);
renderer.domElement.addEventListener('click', onMouseMove, false);
document.addEventListener('keydown',e => {
	console.log(e)
	if(e.key === "Escape") {
		currentObject = sun.mesh;
		updateExtract()
    }
},false)

function updateExtract() {
	getExtract(currentObject.name).then(resp => {
		textBox.innerHTML = resp.query.pages[resp.query.pageids[0]+""].extract
		moreInfo.href = `https://en.wikipedia.org/?curid=${resp.query.pageids[0]}`
		moreInfo.hidden = false
	})
}
updateExtract()
function onMouseMove(e: MouseEvent) {

	mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(planets, true)
	//var raycaster = projector.pickingRay( mouseVector.clone(), camera ),
	//	intersects = raycaster.intersectObjects( cubes.children );
	if(intersects.length > 0){
		currentObject = intersects[0].object
		updateExtract()
	}

}


function onWindowResize(e: UIEvent) {
	containerWidth = document.body.clientWidth;
	containerHeight = document.body.clientHeight;
	renderer.setSize(containerWidth, containerHeight);
	camera.aspect = containerWidth / containerHeight;
	camera.updateProjectionMatrix();
}
