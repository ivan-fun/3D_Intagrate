import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { TextureLoader } from 'three';


const canvasElement = document.getElementById('canvas_3d');

const scene = new THREE.Scene();
scene.environmentIntensity = 0.9;

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-5, -45, 25);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight2.position.set(5, 10, 25);
scene.add(directionalLight2);

const camera = new THREE.PerspectiveCamera(30, canvasElement.clientWidth / canvasElement.clientHeight, 0.1, 1000);
camera.position.set(0, -0.2, 22);
console.log("Camera:", camera.position);

const renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);

function setCanvasSize() {
  const width = canvasElement.clientWidth;
  const height = canvasElement.clientHeight;
  const pixelRatio = window.devicePixelRatio;

  canvasElement.width = width * pixelRatio;
  canvasElement.height = height * pixelRatio;

  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

setCanvasSize();
window.addEventListener('resize', setCanvasSize);


const rgbeLoader = new RGBELoader();
rgbeLoader.load('source/Ambiance.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = null;
});

const textureLoader = new TextureLoader();
const roughnessTexture = textureLoader.load('source/roughness.jpg', () => {
  roughnessTexture.wrapS = THREE.RepeatWrapping;
  roughnessTexture.wrapT = THREE.RepeatWrapping;
  roughnessTexture.repeat.set(3.5,3.5);
});

let model = null;
const loader = new GLTFLoader();
let isTouchDevice = 'ontouchstart' in window;

if (isTouchDevice) {
  loader.load('source/tickets4.gltf', (gltf) => {
    model = gltf.scene;
    model.position.set(0, 0.4, 0);
    model.traverse((child) => {
      if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
              color: 0xDA96EA,
              roughnessMap: roughnessTexture,
              metalness: 0.01,
              roughness: 0.2
          });
          child.material.needsUpdate = true;
      }
    });
    scene.add(model);
  });
} else {
  loader.load('source/tickets3.gltf', (gltf) => {
    model = gltf.scene;
    model.position.set(0, 0.4, 0);
    model.traverse((child) => {
      if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
              color: 0xDA96EA,
              roughnessMap: roughnessTexture,
              metalness: 0.01,
              roughness: 0.2
          });
          child.material.needsUpdate = true;
      }
    });
    scene.add(model);
  });
}


let angleX = 0;
let angleY = 5;
const amplitude = 18;
const speed = 0.0065;
const easing = Math.sin;

let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;
const lerpFactor = 0.02;
const rotationStrength = 0.2;


if (!isTouchDevice) {
  window.addEventListener('mousemove', (event) => {
    const { innerWidth, innerHeight } = window;
    let normalizedX = (event.clientX / innerWidth) * 2 - 1;
    let normalizedY = (event.clientY / innerHeight) * 2 - 1;
    targetRotationX = normalizedY * Math.PI * rotationStrength;
    targetRotationY = normalizedX * Math.PI * rotationStrength;
  });
}

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    if (isTouchDevice) {
      const rotationX = amplitude * Math.sin(angleX) * (Math.PI / 180);
      const rotationY = amplitude * Math.sin(angleX + Math.PI / 2) * (Math.PI / 180);
      model.rotation.x = rotationX;
      model.rotation.y = rotationY;
      angleX += speed;
    } else {
      currentRotationX += (targetRotationX - currentRotationX) * lerpFactor;
      currentRotationY += (targetRotationY - currentRotationY) * lerpFactor;
      model.rotation.x = currentRotationX;
      model.rotation.y = currentRotationY;
    }
  }
  renderer.render(scene, camera);
}

animate();

