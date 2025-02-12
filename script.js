import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { TextureLoader } from 'three';



// Получаем canvas
const canvasElement = document.getElementById('canvas_3d');
if (!canvasElement) {
    console.error("Canvas not found");
}

// Создаем сцену
const scene = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera(30, canvasElement.clientWidth / canvasElement.clientHeight, 0.1, 1000);
camera.position.set(0, -1, 20);
console.log("Camera:", camera.position);

// LIGHT

const pointLight = new THREE.PointLight(0xffffff, 20, 0);
pointLight.position.set(0, 5, 20);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.4); // Белый свет, интенсивность 2
directionalLight.position.set(10, 0, 35); // Размещаем свет сверху и немного сбоку
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.4); // Белый свет, интенсивность 2
directionalLight2.position.set(-20, 10, 55); // Размещаем свет сверху и немного сбоку
scene.add(directionalLight2);


// RENDERER
const renderer = new THREE.WebGLRenderer({ canvas: canvasElement, alpha: true });
renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

//HDR LOADER
const rgbeLoader = new RGBELoader();
rgbeLoader.load('source/Ambiance.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = null;
});

// TEXTURES LOADING
const textureLoader = new TextureLoader();
const roughnessTexture = textureLoader.load('source/roughness.jpg');

// Загрузка модели
const loader = new GLTFLoader();
loader.load('source/tickets3.gltf', (gltf) => {
  const model = gltf.scene;

  // Настройка материала
  model.traverse((child) => {
    if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
            color: 0xDD99DD,
            roughnessMap: roughnessTexture,
            metalness: 0.1,
            roughness: 0.2
        });
        child.material.needsUpdate = true;
    }
  });

  scene.add(model);

  // Анимация поворота
  let angleX = 0;
  let angleY = 5;
  const amplitude = 12; // Амплитуда вращения объекта (можно менять здесь)
  const speed = 0.005; // Скорость вращения объекта (можно менять здесь)
  const easing = Math.sin; // Настройка кривой ускорения (можно менять функцию здесь)

 function animate() {
    requestAnimationFrame(animate);

    // Вычисление углов с фазовым сдвигом
    const rotationX = amplitude * Math.sin(angleX) * (Math.PI / 180);
    const rotationY = amplitude * Math.sin(angleX + Math.PI / 2) * (Math.PI / 180);

    model.rotation.x = rotationX;
    model.rotation.y = rotationY;

    // Увеличение угла
    angleX += speed;

    renderer.render(scene, camera);
}

  animate();
});

// Освещение
const lightIntensity = 0.4; // Сила освещения карты окружения
scene.environmentIntensity = lightIntensity;

// // Рендерер, привязанный к canvas
// const renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true, alpha: true });
// renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1.0;


// // Переменная для анимаций
// let mixer = null;

// // Загрузка модели
// const loader = new GLTFLoader();
// loader.load('source/tickets.glb', function (gltf) {
//     console.log("Model:", gltf);

//     const model = gltf.scene;
//     scene.add(model);

//       if (gltf.textures && gltf.textures.length > 0) {
//         console.log("Найдено текстур:", gltf.textures.length);
//     } else {
//         console.warn("The model does not have built-in textures.");
//     }


//     // Проверяем и активируем текстуры
//     model.traverse((child) => {
//         if (child.isMesh) {
//             console.log("Geometry:", child);

//             // Проверяем, есть ли у меша материал
//             if (child.material) {
//                 console.log("Материал найден:", child.material);

//                 // Если текстура отсутствует, пытаемся включить стандартный цвет
//                 if (child.material.map) {
//                     console.log("Текстура загружена:", child.material.map);
//                 } else {
//                     console.warn("Текстура отсутствует, добавляем цвет по умолчанию.");
//                     child.material.color.set(0xff66bb); // Белый цвет вместо текстуры
//                 }

//                 // Убеждаемся, что материал видимый
//                 child.material.visible = true;
//                 child.material.needsUpdate = true;
//             } else {
//                 console.warn("Материал не найден, устанавливаем базовый.");
//                 child.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
//             }
//         }
//     });

//     // Проверяем наличие встроенного освещения
//     const lights = [];
//     model.traverse((child) => {
//         if (child.isLight) {
//             lights.push(child);
//             console.log("Обнаружен встроенный источник света:", child);
//         }
//     });

//     if (lights.length === 0) {
//         console.warn("The model does not have built-in lighting");

//         const defaultLight = new THREE.DirectionalLight(0xffffff, 2);
//         defaultLight.position.set(5, 5, 5);
//         scene.add(defaultLight);

//         const pointLight2 = new THREE.PointLight(0x000000, 20, 10);
// 		pointLight2.position.set(5, 5, 5);
// 		scene.add(pointLight2);

//     } else {
//         console.log("Use built-in lighting");
//         // Освещение
// 		const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Мягкий свет
// 		scene.add(ambientLight);
//     }

//     // Проверяем наличие анимаций
//     if (gltf.animations.length > 0) {
//         mixer = new THREE.AnimationMixer(model);
//         gltf.animations.forEach((clip) => {
//             const action = mixer.clipAction(clip);
//             action.play();
//         });
//     } else {
//         console.warn("No animations in the model");
//     }
// }, 
// 	undefined, function (error) {
//     console.error('Model loading error', error);
// });


// // Анимация рендера
// function animate() {
//     requestAnimationFrame(animate);
//     if (mixer) mixer.update(0.016);
//     renderer.render(scene, camera);
// }
// animate();



// // Обработчик изменения размеров окна
// window.addEventListener('resize', () => {
//     camera.aspect = canvasElement.clientWidth / canvasElement.clientHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
//     console.log("Размеры canvas обновлены");
// });

// // Отладка: проверка размеров canvas
// console.log("Canvas size:", canvasElement.clientWidth, canvasElement.clientHeight);