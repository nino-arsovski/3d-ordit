import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 1); // White ambient light
scene.add(light);

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
const loader = new GLTFLoader();

// Load the GLB model
loader.load(
  "/model/city 2.glb", // Replace with your correct URL
  (gltf) => {
    // On successful load
    scene.add(gltf.scene);
    camera.position.set(50, 50, 50); // Adjust camera position
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

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation of the damping (inertia)
controls.dampingFactor = 0.25; // damping factor
controls.screenSpacePanning = false; // Set to true to allow panning in screen space
controls.maxPolarAngle = Math.PI / 2; // Prevent going under the ground

// Render loop
function render() {
  requestAnimationFrame(render);
  controls.update(); // Update controls
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});