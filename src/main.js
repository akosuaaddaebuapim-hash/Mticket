import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { createCar, createPalmTree } from './utils.js';

// Get a reference to the loading screen
const loadingScreen = document.getElementById('loading-screen');
const uiControls = document.getElementById('ui-controls');

// --- Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialiasing: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Player controls for first-person view
const controls = new PointerLockControls(camera, document.body);
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let rotationSpeed = 0.005;

// Lock controls when clicking on the screen
renderer.domElement.addEventListener('click', () => {
    controls.lock();
});

controls.addEventListener('lock', () => {
    uiControls.style.display = 'none';
});
controls.addEventListener('unlock', () => {
    uiControls.style.display = 'block';
});

// Movement logic
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW': moveForward = true; break;
        case 'KeyS': moveBackward = true; break;
        case 'KeyA': moveLeft = true; break;
        case 'KeyD': moveRight = true; break;
    }
});
document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW': moveForward = false; break;
        case 'KeyS': moveBackward = false; break;
        case 'KeyA': moveLeft = false; break;
        case 'KeyD': moveRight = false; break;
    }
});

// --- Materials ---
const materials = {
    skyscraper: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, metalness: 0.9 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x2a52be, transparent: true, opacity: 0.6, roughness: 0.2, metalness: 0.9 }),
    light: new THREE.MeshBasicMaterial({ color: 0x42f5ad }),
    ground: new THREE.MeshStandardMaterial({ color: 0x3d702e, roughness: 0.9 }),
    road: new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 }),
    palmTrunk: new THREE.MeshStandardMaterial({ color: 0x8b5a2b }),
    palmLeaves: new THREE.MeshStandardMaterial({ color: 0x006400, side: THREE.DoubleSide }),
    lobbyFloor: new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5, metalness: 0.2 }),
    elevator: new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.3 })
};

// --- Skyscraper Parameters ---
const numFloors = 23;
const floorHeight = 5;
const floorWidth = 25;
let lightsOn = false;
let lastLightToggleTime = 0;

// --- Build the Skyscraper ---
function createSkyscraper() {
    const skyscraperGroup = new THREE.Group();

    // Main central core (twisted)
    const coreGeometry = new THREE.CylinderGeometry(floorWidth / 2, floorWidth / 2, numFloors * floorHeight, 16);
    const coreMesh = new THREE.Mesh(coreGeometry, materials.skyscraper);
    coreMesh.position.y = (numFloors * floorHeight) / 2;
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    skyscraperGroup.add(coreMesh);

    // Add unique, asymmetrical spires and fins
    const spire1 = new THREE.Mesh(new THREE.ConeGeometry(5, 50, 8), materials.detail);
    spire1.position.set(20, 120, 0);
    spire1.castShadow = true;
    skyscraperGroup.add(spire1);

    const fin = new THREE.Mesh(new THREE.BoxGeometry(2, 100, 1), materials.detail);
    fin.position.set(-15, 80, 10);
    fin.rotation.y = Math.PI / 4;
    fin.castShadow = true;
    skyscraperGroup.add(fin);

    // Add glowing window lights
    const windowGeometry = new THREE.PlaneGeometry(3, 3);
    const windowOffset = floorWidth / 2 + 0.1;

    for (let i = 0; i < numFloors; i++) {
        const floorY = (i * floorHeight) - ((numFloors * floorHeight) / 2);

        // Randomly place windows on all four sides with a slight rotation
        for(let j = 0; j < 4; j++) {
            const sideOffset = j * Math.PI / 2;
            const windowMesh = new THREE.Mesh(windowGeometry, materials.glass);
            windowMesh.position.set(windowOffset * Math.cos(sideOffset), floorY + 2.5, windowOffset * Math.sin(sideOffset));
            windowMesh.rotation.y = sideOffset;
            skyscraperGroup.add(windowMesh);

            const lightMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8), materials.light);
            lightMesh.position.copy(windowMesh.position);
            lightMesh.position.y += 0.01;
            lightMesh.rotation.copy(windowMesh.rotation);
            lightMesh.visible = Math.random() > 0.5; // Randomly turn on lights
            skyscraperGroup.add(lightMesh);
        }
    }
    
    // Lobby
    const lobby = new THREE.Mesh(new THREE.BoxGeometry(floorWidth * 1.5, floorHeight * 2, floorWidth * 1.5), materials.glass);
    lobby.position.y = floorHeight;
    lobby.castShadow = true;
    lobby.receiveShadow = true;
    skyscraperGroup.add(lobby);

    // Interior floor and elevators
    const lobbyFloor = new THREE.Mesh(new THREE.PlaneGeometry(floorWidth * 1.4, floorWidth * 1.4), materials.lobbyFloor);
    lobbyFloor.rotation.x = -Math.PI / 2;
    lobbyFloor.position.y = floorHeight * 0.5;
    lobbyFloor.receiveShadow = true;
    skyscraperGroup.add(lobbyFloor);

    const elevator1 = new THREE.Mesh(new THREE.BoxGeometry(4, 10, 4), materials.elevator);
    elevator1.position.set(5, 5, 0);
    elevator1.castShadow = true;
    skyscraperGroup.add(elevator1);

    const elevator2 = new THREE.Mesh(new THREE.BoxGeometry(4, 10, 4), materials.elevator);
    elevator2.position.set(-5, 5, 0);
    elevator2.castShadow = true;
    skyscraperGroup.add(elevator2);

    return skyscraperGroup;
}

// --- Environment ---
function createEnvironment() {
    const environmentGroup = new THREE.Group();

    // Ground
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), materials.ground);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    environmentGroup.add(ground);

    // Roads
    const road = new THREE.Mesh(new THREE.BoxGeometry(500, 0.1, 20), materials.road);
    road.position.z = 100;
    road.position.y = 0.05;
    environmentGroup.add(road);
    const road2 = new THREE.Mesh(new THREE.BoxGeometry(500, 0.1, 20), materials.road);
    road2.position.z = -100;
    road2.position.y = 0.05;
    environmentGroup.add(road2);

    // Palm trees
    for (let i = 0; i < 20; i++) {
        const tree = createPalmTree(materials);
        tree.position.x = (Math.random() - 0.5) * 300;
        tree.position.z = (Math.random() - 0.5) * 300;
        tree.position.y = tree.children[0].geometry.parameters.height / 2;
        environmentGroup.add(tree);
    }

    // Cars on the road
    for (let i = 0; i < 5; i++) {
        const car = createCar(materials);
        car.position.x = (Math.random() - 0.5) * 400;
        car.position.z = Math.random() > 0.5 ? 100 : -100;
        car.position.y = 0;
        environmentGroup.add(car);
    }
    
    return environmentGroup;
}

// --- Light Toggling ---
document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyL' && (Date.now() - lastLightToggleTime) > 500) {
        lightsOn = !lightsOn;
        toggleBuildingLights(lightsOn);
        lastLightToggleTime = Date.now();
    }
});

function toggleBuildingLights(state) {
    scene.traverse((object) => {
        if (object.material && object.material.color && object.material.color.getHex() === materials.light.color.getHex()) {
            object.visible = state;
        }
    });
}

// --- Animation Loop ---
let lastTime = performance.now();
const moveSpeed = 0.5;

function animate(time) {
    const delta = (time - lastTime) / 1000;
    lastTime = time;

    if (controls.isLocked) {
        if (moveForward) controls.moveForward(moveSpeed);
        if (moveBackward) controls.moveForward(-moveSpeed);
        if (moveLeft) controls.moveRight(-moveSpeed);
        if (moveRight) controls.moveRight(moveSpeed);
    }

    // Rotate the skyscraper slowly
    skyscraper.rotation.y += rotationSpeed;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Create and start scene
const skyscraper = createSkyscraper();
const environment = createEnvironment();
scene.add(skyscraper);
scene.add(environment);

// Position camera initially
camera.position.set(80, 20, 80);
camera.lookAt(new THREE.Vector3(0, 30, 0));

// Hide loading screen and start animation
loadingScreen.style.display = 'none';
animate(0);

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
