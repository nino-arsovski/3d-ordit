import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { HorizontalBlurShader, RGBELoader, ShaderPass, VerticalBlurShader } from 'three/examples/jsm/Addons.js';
// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ambient light
const light2 = new THREE.DirectionalLight(0xddffff, 3); // White ambient light
scene.add(light2);
// Add a loading spinner
const loadingDiv = document.createElement('div');
loadingDiv.innerText = 'Loading...';
loadingDiv.style.position = 'absolute';
loadingDiv.style.top = '50%';
loadingDiv.style.left = '50%';
loadingDiv.style.transform = 'translate(-50%, -50%)';
loadingDiv.style.fontSize = '24px';
loadingDiv.style.color = '#fff';
document.body.appendChild(loadingDiv);

// Create a loader instance

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation of the damping (inertia)
controls.dampingFactor = 0.25; // damping factor
controls.screenSpacePanning = false; // Set to true to allow panning in screen space
controls.maxPolarAngle = Math.PI / 2; // Prevent going under the ground

// Setup post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const horizontalBlurShader = new ShaderPass(HorizontalBlurShader);
horizontalBlurShader.uniforms['h'].value = .5 / window.innerWidth; // Horizontal blur
composer.addPass(horizontalBlurShader);

const verticalBlurShader = new ShaderPass(VerticalBlurShader);
verticalBlurShader.uniforms['v'].value = .5 / window.innerHeight; // Vertical blur
composer.addPass(verticalBlurShader);

// Render loop
const loader = new GLTFLoader();

// Load the GLB model
loader.load(
  "/model/city 2.glb", // Replace with your correct URL
  (gltf) => {
    // On successful load
    scene.add(gltf.scene);
    camera.position.set(100, 100, 100); // Adjust camera position
    loadingDiv.style.display = 'none'; // Hide loading indicator
    render(); // Start rendering
  },
  (xhr) => {
    // Optional: display loading progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  (error) => {
    console.error('An error occurred while loading the model:', error);
    loadingDiv.innerText = 'Error loading model';
  }
);

// Handle window resize
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  composer.setSize(width, height); // Update composer size
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
function render() {
  requestAnimationFrame(render);
  controls.update(); // Update controls

  // Use composer to render the scene with post-processing
  if (composer)
    composer.render();
}

render()