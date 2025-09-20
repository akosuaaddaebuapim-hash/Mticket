import * as THREE from 'three'; import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// SkyscraperScene(container) // Enhanced: Accra-inspired, parametric, landscaped environment, terraces, fins, lighting, and GLTF/GLB download export default function SkyscraperScene(container) { // --- Basic renderer / scene --- const scene = new THREE.Scene(); scene.background = new THREE.Color(0xCFEFF6); // warm sky tint inspired by Accra afternoons

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 5000); camera.position.set(180, 220, 360);

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); renderer.setSize(container.clientWidth, container.clientHeight); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; container.appendChild(renderer.domElement);

// --- Controls --- const controls = new OrbitControls(camera, renderer.domElement); controls.target.set(0, 60, 0); controls.enableDamping = true; controls.dampingFactor = 0.07;

// --- Lights (golden hour feel) --- const hemi = new THREE.HemisphereLight(0xfff6e6, 0x606070, 0.65); scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfff0d1, 1.0); sun.position.set(220, 360, 160); sun.castShadow = true; sun.shadow.camera.left = -500; sun.shadow.camera.right = 500; sun.shadow.camera.top = 500; sun.shadow.camera.bottom = -500; sun.shadow.mapSize.set(2048, 2048); scene.add(sun);

// subtle fill from opposite side const backLight = new THREE.DirectionalLight(0xbbe6ff, 0.25); backLight.position.set(-200, 120, -140); scene.add(backLight);

// --- Ground & plaza --- const ground = new THREE.Mesh( new THREE.PlaneGeometry(1200, 1200), new THREE.MeshStandardMaterial({ color: 0xe7efe9, roughness: 0.95 }) ); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

// tiled plaza const plaza = new THREE.Mesh( new THREE.CircleGeometry(120, 64), new THREE.MeshStandardMaterial({ color: 0xf5f2ea, roughness: 0.9 }) ); plaza.rotation.x = -Math.PI / 2; plaza.position.y = 0.01; plaza.receiveShadow = true; scene.add(plaza);

// road const road = new THREE.Mesh( new THREE.BoxGeometry(1200, 0.5, 28), new THREE.MeshStandardMaterial({ color: 0x2d2d2d, roughness: 0.9 }) ); road.position.set(0, -0.25, -220); road.receiveShadow = true; scene.add(road);

// sidewalks const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xe6e1d9, roughness: 0.95 }); const sidewalkL = new THREE.Mesh(new THREE.BoxGeometry(1200, 0.3, 10), sidewalkMat); sidewalkL.position.set(0, 0.15, -240); sidewalkL.receiveShadow = true; scene.add(sidewalkL);

// --- Skyscraper parameters (customizable) --- const params = { floors: 23, baseWidth: 44, baseDepth: 30, floorHeight: 3.6, taper: 0.22, rotationOffset: 0, terraces: true, greenRoofDensity: 0.6, façadeFins: true };

// Materials const matGlass = new THREE.MeshStandardMaterial({ color: 0xe1f7ff, metalness: 0.12, roughness: 0.16, transparent: true, opacity: 0.95 }); const matMetal = new THREE.MeshStandardMaterial({ color: 0xbfc7cf, metalness: 0.9, roughness: 0.2 }); const matWarm = new THREE.MeshStandardMaterial({ color: 0xd07a3f, metalness: 0.05, roughness: 0.8 }); const matConcrete = new THREE.MeshStandardMaterial({ color: 0xd6d1c7, roughness: 0.9 }); const matGreen = new THREE.MeshStandardMaterial({ color: 0x2b7a3a, roughness: 0.9 });

// Root group const root = new THREE.Group(); scene.add(root);

// Create surrounding low-rise context (Accra-esque)</n  function createContext() { const ctxGroup = new THREE.Group(); const cols = 6; for (let i = 0; i < cols; i++) { const w = 30 + Math.random() * 20; const d = 20 + Math.random() * 20; const h = 18 + Math.random() * 22; const bx = (i - Math.floor(cols/2)) * 80 + (Math.random() * 20 - 10); const bz = -100 + (Math.random() * 80 - 40); const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matConcrete); b.position.set(bx, h/2, bz); b.castShadow = true; b.receiveShadow = true; ctxGroup.add(b);

// small shopfront
  if (Math.random() > 0.6) {
    const shop = new THREE.Mesh(new THREE.BoxGeometry(w*0.9, 6, d*0.6), matWarm);
    shop.position.set(bx + 0, 3, bz - d*0.3 - 2);
    ctxGroup.add(shop);
  }
}
root.add(ctxGroup);

} createContext();

// Procedural skyscraper builder with setbacks, cantilevers, terraces and green pockets const building = new THREE.Group(); root.add(building);

function buildBuilding() { // clear previous while (building.children.length) { const ch = building.children[0]; ch.traverse(node => { if (node.geometry) node.geometry.dispose(); if (node.material) { if (Array.isArray(node.material)) node.material.forEach(m=>m.dispose()); else node.material.dispose(); } }); building.remove(ch); }

const floors = params.floors;
const baseW = params.baseWidth;
const baseD = params.baseDepth;
const fh = params.floorHeight;
const taper = params.taper;

// podium
const podium = new THREE.Mesh(new THREE.BoxGeometry(baseW * 1.4, 8, baseD * 1.6), matConcrete);
podium.position.y = 4;
podium.castShadow = true; podium.receiveShadow = true;
building.add(podium);

// atrium - a vertical void using glass cage
const atriumGeo = new THREE.CylinderGeometry(6, 6, fh * floors * 0.95, 16);
const atriumMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 });
const atrium = new THREE.Mesh(atriumGeo, atriumMat);
atrium.position.set(-baseW*0.15, fh * floors/2 + 8, 0);
building.add(atrium);

// stack floors with variable footprints and terrace pockets
let currentYOffset = 8;
for (let i = 0; i < floors; i++) {
  const t = i / floors;
  // progressive taper + occasional cantilevers
  const width = baseW * (1 - taper * t) + (Math.sin(i * 0.6) * 0.6);
  const depth = baseD * (1 - taper * t * 0.6) + (Math.cos(i * 0.4) * 0.5);
  const h = fh * (1 + (i % 5 === 0 ? 0.25 : 0));

  const slab = new THREE.Mesh(new THREE.BoxGeometry(width, h, depth), matGlass);
  // slightly rotate stacks around their center for a sculpted look
  slab.position.set(Math.sin(i*0.8)*0.6, currentYOffset + h/2, Math.cos(i*0.5)*0.8);
  slab.rotation.y = Math.sin(i * 0.12) * 0.025;
  slab.castShadow = true; slab.receiveShadow = true;
  building.add(slab);

  // add vertical fins (sun-shades)
  if (params.façadeFins) {
    const fins = new THREE.Group();
    const finCount = Math.max(3, Math.floor(width / 6));
    for (let f = 0; f < finCount; f++) {
      const fx = -width/2 + (f + 0.5) * (width / finCount);
      const finGeom = new THREE.BoxGeometry(0.45, h*0.9, depth*0.06);
      const fin = new THREE.Mesh(finGeom, matMetal);
      fin.position.set(fx, currentYOffset + h/2, depth/2 + 0.03);
      fins.add(fin);
      const finBack = fin.clone(); finBack.position.z = -fin.position.z; fins.add(finBack);
    }
    building.add(fins);
  }

  // terrace pockets with planters (every 6th floor)
  if (params.terraces && (i % 6 === 4 || i % 6 === 1)) {
    const terrace = new THREE.Mesh(new THREE.BoxGeometry(width * 0.6, 0.6, depth * 0.35), matConcrete);
    terrace.position.set(slab.position.x + (width*0.38), currentYOffset + 0.3, slab.position.z + (depth*0.32));
    building.add(terrace);

    // planters with palm-like trees
    const plants = new THREE.Group();
    const plantCount = Math.floor(2 + Math.random()*3);
    for (let p = 0; p < plantCount; p++) {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 2, 6), matWarm);
      trunk.position.set(terrace.position.x + (Math.random()-0.5)*4, terrace.position.y + 1, terrace.position.z + (Math.random()-0.5)*3);
      plants.add(trunk);
      const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.8, 4, 8), matGreen);
      leaves.position.set(trunk.position.x, trunk.position.y + 2, trunk.position.z);
      leaves.rotation.x = Math.PI;
      plants.add(leaves);
    }
    building.add(plants);
  }

  currentYOffset += h;
}

// crown: a tapered glass lantern
const lanternGeo = new THREE.CylinderGeometry(6, 12, 12, 24, 1, true);
const lantern = new THREE.Mesh(lanternGeo, matGlass);
lantern.position.set(0, currentYOffset + 8, 0);
lantern.castShadow = true; building.add(lantern);

// rooftop garden
const roof = new THREE.Mesh(new THREE.BoxGeometry(baseW * (1 - taper), 0.8, baseD * 0.5), matGreen);
roof.position.set(0, currentYOffset + 2.2, 0);
building.add(roof);

// subtle rotation
building.rotation.y = THREE.MathUtils.degToRad(params.rotationOffset);

}

buildBuilding();

// small decorative fountain in plaza const fountain = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 0.8, 32), new THREE.MeshStandardMaterial({ color: 0xd7f0ff, roughness: 0.2, metalness: 0.1 })); fountain.position.set(-40, 0.4, 20); scene.add(fountain);

// streetlights function makeLamp(x, z) { const lamp = new THREE.Group(); const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 6, 8), matMetal); pole.position.y = 3; lamp.add(pole); const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.25, 0.6), new THREE.MeshStandardMaterial({ color: 0xfff3d9, emissive: 0xffe8b0, emissiveIntensity: 0.6 })); head.position.set(0, 5.2, 0); lamp.add(head); lamp.position.set(x, 0, z); scene.add(lamp); } makeLamp(60, -230); makeLamp(-60, -230); makeLamp(120, -240);

// ambient animated city glow via emissive windows function addWindowLights() { building.traverse(node => { if (node.isMesh && node.material === matGlass) { // create an emissive layer by cloning and scaling slightly const glow = node.clone(); const em = new THREE.MeshStandardMaterial({ color: 0x0d2740, emissive: 0x0d2740, emissiveIntensity: 0.02, transparent: true, opacity: 0.22 }); glow.material = em; glow.scale.set(1.001, 1.001, 1.001); scene.add(glow); } }); } // addWindowLights(); // optional heavy op

// --- Simple UI overlay (no external deps) --- const ui = document.createElement('div'); ui.style.position = 'absolute'; ui.style.top = '12px'; ui.style.left = '12px'; ui.style.zIndex = 1000; ui.style.padding = '10px'; ui.style.background = 'rgba(20,20,20,0.35)'; ui.style.color = '#fff'; ui.style.fontFamily = 'system-ui, Arial'; ui.style.borderRadius = '8px'; container.appendChild(ui);

ui.innerHTML = <div style="font-weight:700;margin-bottom:6px">Scribe Haus — Skyscraper Preview</div> <label style="font-size:12px">Floors <span id='floorsVal'>${params.floors}</span></label><br /> <input id='floors' type='range' min='6' max='60' value='${params.floors}' style='width:220px' /><br /> <label style="font-size:12px">Taper <span id='taperVal'>${params.taper}</span></label><br /> <input id='taper' type='range' min='0' max='0.5' step='0.01' value='${params.taper}' style='width:220px' /><br /> <button id='rebuild' style='margin-top:8px;padding:6px 10px;background:#1f2937;border:none;color:#fff;border-radius:6px;cursor:pointer'>Rebuild</button> <button id='exportGLTF' style='margin-top:8px;margin-left:8px;padding:6px 10px;background:#047857;border:none;color:#fff;border-radius:6px;cursor:pointer'>Download GLTF</button> <button id='exportGLB' style='margin-top:8px;margin-left:8px;padding:6px 10px;background:#0ea5a4;border:none;color:#fff;border-radius:6px;cursor:pointer'>Download GLB</button>;

// UI bindings ui.querySelector('#floors').addEventListener('input', (e)=>{ params.floors = Number(e.target.value); ui.querySelector('#floorsVal').innerText = params.floors; }); ui.querySelector('#taper').addEventListener('input', (e)=>{ params.taper = Number(e.target.value); ui.querySelector('#taperVal').innerText = params.taper; }); ui.querySelector('#rebuild').addEventListener('click', ()=>{ buildBuilding(); });

// Export functions const exporter = new GLTFExporter();

function saveArrayBuffer(buffer, filename) { const blob = new Blob([buffer], { type: 'application/octet-stream' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename; link.click(); setTimeout(()=>URL.revokeObjectURL(link.href), 1500); }

function saveString(text, filename) { const blob = new Blob([text], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename; link.click(); setTimeout(()=>URL.revokeObjectURL(link.href), 1500); }

ui.querySelector('#exportGLTF').addEventListener('click', ()=>{ exporter.parse(building, (result)=>{ const output = JSON.stringify(result, null, 2); saveString(output, scribehaus_skyscraper_${params.floors}f.gltf); }, { binary: false }); });

ui.querySelector('#exportGLB').addEventListener('click', ()=>{ exporter.parse(building, (result)=>{ // result is an ArrayBuffer when binary:true saveArrayBuffer(result, scribehaus_skyscraper_${params.floors}f.glb); }, { binary: true }); });

// Render loop function animate() { requestAnimationFrame(animate); building.rotation.y += 0.0008; // presentational spin controls.update(); renderer.render(scene, camera); } animate();

// Responsiveness window.addEventListener('resize', ()=>{ camera.aspect = container.clientWidth / container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth, container.clientHeight); }); }

