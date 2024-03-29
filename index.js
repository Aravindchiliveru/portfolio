import * as THREE from 'three'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'
import gsap from 'gsap'
import imagewrap from './globe.jpg'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const canvasContainer = document.querySelector('#canvasContainer')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    canvasContainer.offsetWidth/canvasContainer.offsetHeight,
    0.1,
    1000
)
const renderer = new THREE.WebGLRenderer(
    {
        antialias : true,
        canvas : document.querySelector('canvas')
    }
    )
    const controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)

const sphere = new THREE.Mesh(new THREE.SphereGeometry(5,50,50), new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
     uniforms : {
         globeTexture: {
         value : new THREE.TextureLoader().load(imagewrap) 
     }
    }
}))


const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(5,50,50), new THREE.ShaderMaterial({
    // color : 0xFF0000
        vertexShader: atmosphereVertexShader,
       fragmentShader : atmosphereFragmentShader,
       blending : THREE.AdditiveBlending,
       side : THREE.BackSide
}))

atmosphere.scale.set(1.1, 1.1, 1.1)

scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
    color : 0xffffff
})

const starVertices = []
for(let i=0; i<50000; i++){
    const x = (Math.random() - 0.5)*2000
    const y = (Math.random() - 0.5)*2000
    const z = -(Math.random())*2000
    starVertices.push(x,y,z)
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(
    starVertices, 4
))

const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)
camera.position.z = 13

const mouse = {
    x : 0,
    y : 0
}

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    sphere.rotation.y += 0.001
    controls.update()
    gsap.to(group.rotation, {
        x : mouse.y * 0.3,
        y : mouse.x * 0.5,
        duration : 2,
    })
}

animate()


addEventListener('mousemove', () => {
    mouse.x = (event.clientX/innerWidth)*2 - 1;
    mouse.y = (event.clientY/innerHeight)*2 + 1;
})

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const square = entry.target.querySelector('.square');
  
      if (entry.isIntersecting) {
        square.classList.add('square-animation');
        return; // if we added the class, exit the function
      }
  
      // We're not intersecting, so remove the class!
      square.classList.remove('square-animation');
    });
  });
  
  observer.observe(document.querySelector('.container'));