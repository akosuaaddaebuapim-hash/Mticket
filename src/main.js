import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';

const container = document.getElementById('app');

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.domElement.classList.add('webgl');
container.appendChild(renderer.domElement);

// Scene & Camera
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0b0f14, 0.018);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(28, 24, 42);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;

// Lights
const hemiLight = new THREE.HemisphereLight(0xcfe9ff, 0x0c1016, 1.0);
hemiLight.position.set(0, 1, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
dirLight.position.set(20, 50, 30);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024);
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 200;
dirLight.shadow.camera.left = -80;
dirLight.shadow.camera.right = 80;
dirLight.shadow.camera.top = 80;
dirLight.shadow.camera.bottom = -80;
scene.add(dirLight);

// Ground
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(140, 80),
  new THREE.MeshStandardMaterial({ color: 0x0e1420, metalness: 0.1, roughness: 0.9 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const grid = new THREE.GridHelper(280, 80, 0x274055, 0x132232);
grid.position.y = 0.01;
scene.add(grid);

// Parameters
const params = {
  floors: 23,
  floorHeight: 3.6,
  coreRadius: 4.4,
  baseWidth: 14,
  baseDepth: 10,
  taper: 0.38,
  totalTwistDeg: 220,
  finCount: 6,
  finDepth: 1.0,
  autoRotate: true,
  rotationSpeed: 0.4,
  wireframe: false,
  day: true,
  randomizeSeed: 1,
};

let towerGroup = null;
let windowMeshes = [];

function random(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function createFloorMaterial(levelIndex, totalLevels) {
  const t = levelIndex / Math.max(1, totalLevels - 1);
  const hue = 0.58 + 0.06 * t; // steel-blue to violet tint
  const color = new THREE.Color().setHSL(hue % 1, 0.12, 0.72);
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.55,
    roughness: 0.35,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25,
    transmission: 0.0,
    reflectivity: 0.6,
    wireframe: params.wireframe,
  });
}

function createGlassMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x9dc9ff).multiplyScalar(0.7),
    emissive: new THREE.Color(0x000000),
    metalness: 0.0,
    roughness: 0.1,
    transmission: 0.85,
    thickness: 0.6,
    transparent: true,
    opacity: 0.9,
  });
}

function buildTower() {
  if (towerGroup) {
    scene.remove(towerGroup);
    towerGroup.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
  }

  towerGroup = new THREE.Group();
  windowMeshes = [];

  const totalHeight = params.floors * params.floorHeight;
  const baseW = params.baseWidth;
  const baseD = params.baseDepth;
  const coreR = params.coreRadius;
  const glassMaterial = createGlassMaterial();

  for (let i = 0; i < params.floors; i++) {
    const t = i / Math.max(1, params.floors - 1);
    const levelWidth = THREE.MathUtils.lerp(baseW, baseW * (1.0 - params.taper), t);
    const levelDepth = THREE.MathUtils.lerp(baseD, baseD * (1.0 - params.taper * 1.15), t);
    const twistRad = THREE.MathUtils.degToRad(params.totalTwistDeg * t);

    const slabHeight = params.floorHeight * 0.16;
    const slabGeo = new THREE.BoxGeometry(levelWidth + 0.4, slabHeight, levelDepth + 0.4);
    const slab = new THREE.Mesh(slabGeo, createFloorMaterial(i, params.floors));
    slab.position.y = i * params.floorHeight + slabHeight * 0.5;
    slab.rotation.y = twistRad;
    slab.castShadow = true;
    slab.receiveShadow = true;
    towerGroup.add(slab);

    const floorClear = params.floorHeight - slabHeight;
    const facadeGeo = new THREE.BoxGeometry(levelWidth, floorClear, levelDepth);
    const facade = new THREE.Mesh(facadeGeo, glassMaterial.clone());
    facade.position.y = i * params.floorHeight + slabHeight + floorClear * 0.5;
    facade.rotation.y = twistRad;
    facade.castShadow = false;
    facade.receiveShadow = false;
    towerGroup.add(facade);
    windowMeshes.push(facade);

    const edges = new THREE.EdgesGeometry(facadeGeo, 30);
    const edgeLines = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x2a3d57, transparent: true, opacity: 0.55 })
    );
    edgeLines.position.copy(facade.position);
    edgeLines.rotation.copy(facade.rotation);
    towerGroup.add(edgeLines);

    const coreH = floorClear * 0.86;
    const coreGeo = new THREE.CylinderGeometry(coreR * 0.75, coreR, coreH, 16);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x101722, metalness: 0.2, roughness: 0.8 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = i * params.floorHeight + slabHeight + coreH * 0.5;
    core.rotation.y = twistRad * 0.65;
    towerGroup.add(core);
  }

  // Crown / spire
  const crownHeight = totalHeight * 0.12;
  const crownGeo = new THREE.ConeGeometry((baseW + baseD) * 0.22, crownHeight, 5);
  const crownMat = new THREE.MeshPhysicalMaterial({ color: 0xeaf6ff, metalness: 0.8, roughness: 0.2, clearcoat: 0.6 });
  const crown = new THREE.Mesh(crownGeo, crownMat);
  crown.position.y = totalHeight + crownHeight * 0.5 + params.floorHeight * 0.2;
  crown.rotation.y = THREE.MathUtils.degToRad(params.totalTwistDeg);
  crown.castShadow = true;
  towerGroup.add(crown);

  // Vertical fins
  const towerRadius = Math.max(params.baseWidth, params.baseDepth) * 0.65 + params.finDepth * 1.4;
  const finHeight = totalHeight * 1.02;
  for (let f = 0; f < params.finCount; f++) {
    const angle = (f / params.finCount) * Math.PI * 2;
    const finGeo = new THREE.BoxGeometry(params.finDepth, finHeight, 0.6);
    const finMat = new THREE.MeshPhysicalMaterial({ color: 0xaad4ff, metalness: 0.6, roughness: 0.35, clearcoat: 0.4, transparent: true, opacity: 0.85 });
    const fin = new THREE.Mesh(finGeo, finMat);
    fin.position.set(Math.cos(angle) * towerRadius, finHeight * 0.5, Math.sin(angle) * towerRadius);
    fin.lookAt(0, fin.position.y, 0);
    fin.castShadow = true;
    towerGroup.add(fin);
  }

  towerGroup.position.y = 0.01;
  scene.add(towerGroup);
}

function setDayNight(isDay) {
  params.day = isDay;
  controls.autoRotate = params.autoRotate;
  renderer.toneMappingExposure = isDay ? 1.0 : 1.6;
  scene.fog.density = isDay ? 0.018 : 0.035;
  scene.background = null;
  hemiLight.intensity = isDay ? 1.0 : 0.3;
  hemiLight.color.set(isDay ? 0xcfe9ff : 0x203040);
  hemiLight.groundColor.set(isDay ? 0x0c1016 : 0x04070b);
  dirLight.intensity = isDay ? 2.2 : 0.9;
  dirLight.color.set(isDay ? 0xffffff : 0xa0b8ff);

  // Windows emissive at night
  for (const mesh of windowMeshes) {
    const m = mesh.material;
    if (!m) continue;
    if (isDay) {
      m.emissive.set(0x000000);
      m.emissiveIntensity = 0.0;
    } else {
      const r = random(params.randomizeSeed + mesh.position.y * 0.13);
      const color = new THREE.Color().setHSL(0.12 + 0.08 * r, 0.8, 0.6 + 0.2 * r);
      m.emissive.copy(color);
      m.emissiveIntensity = 0.7 + 0.5 * r;
    }
  }
}

function rebuild() {
  buildTower();
  setDayNight(params.day);
}

buildTower();
setDayNight(true);

// GUI
const gui = new GUI({ title: 'Skyscraper Controls' });
gui.domElement.style.position = 'absolute';
gui.domElement.style.right = '16px';
gui.domElement.style.top = '76px';

const towerFolder = gui.addFolder('Form');
towerFolder.add(params, 'floors', 10, 60, 1).name('Floors').onFinishChange(rebuild);
towerFolder.add(params, 'floorHeight', 2.5, 6.0, 0.1).name('Floor Height').onFinishChange(rebuild);
towerFolder.add(params, 'taper', 0.0, 0.6, 0.01).name('Taper').onFinishChange(rebuild);
towerFolder.add(params, 'totalTwistDeg', 0, 360, 1).name('Total Twist').onFinishChange(rebuild);
towerFolder.add(params, 'finCount', 0, 12, 1).name('Fins').onFinishChange(rebuild);
towerFolder.add(params, 'finDepth', 0.2, 2.2, 0.05).name('Fin Depth').onFinishChange(rebuild);
towerFolder.add(params, 'wireframe').name('Wireframe').onChange(rebuild);

const motionFolder = gui.addFolder('Motion');
motionFolder.add(params, 'autoRotate').name('Auto Rotate').onChange(v => (controls.autoRotate = v));
motionFolder.add(params, 'rotationSpeed', 0.0, 2.0, 0.05).name('Rotate Speed').onChange(v => (controls.autoRotateSpeed = v));

gui.add(params, 'randomizeSeed', 1, 999, 1).name('Random Seed').onFinishChange(() => setDayNight(params.day));

// HUD buttons
const dayBtn = document.getElementById('toggle-mode');
const shotBtn = document.getElementById('screenshot');
dayBtn?.addEventListener('click', () => setDayNight(!params.day));

shotBtn?.addEventListener('click', () => {
  renderer.render(scene, camera);
  renderer.domElement.toBlob(blob => {
    if (!blob) return;
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `skyscraper23-${timestamp}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, 'image/png');
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
