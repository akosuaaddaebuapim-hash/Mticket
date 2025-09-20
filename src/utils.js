import * as THREE from 'three';

// Creates a simple, stylized car model
export function createCar(materials) {
    const carGroup = new THREE.Group();

    // Main body
    const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x5a5a5a, metalness: 0.8, roughness: 0.5 });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 0.75;
    bodyMesh.castShadow = true;
    carGroup.add(bodyMesh);

    // Cabin
    const cabinGeometry = new THREE.BoxGeometry(2, 1, 1.8);
    const cabinMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 });
    const cabinMesh = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabinMesh.position.set(0, 2.25, 0);
    cabinMesh.castShadow = true;
    carGroup.add(cabinMesh);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 12);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 });

    const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel1.position.set(1.5, 0.5, 1.2);
    wheel1.rotation.x = Math.PI / 2;
    carGroup.add(wheel1);

    const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel2.position.set(-1.5, 0.5, 1.2);
    wheel2.rotation.x = Math.PI / 2;
    carGroup.add(wheel2);

    const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel3.position.set(1.5, 0.5, -1.2);
    wheel3.rotation.x = Math.PI / 2;
    carGroup.add(wheel3);

    const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel4.position.set(-1.5, 0.5, -1.2);
    wheel4.rotation.x = Math.PI / 2;
    carGroup.add(wheel4);

    return carGroup;
}

// Creates a realistic palm tree
export function createPalmTree(materials) {
    const treeGroup = new THREE.Group();
    
    // Trunk
    const trunkHeight = Math.random() * 15 + 15;
    const trunkGeometry = new THREE.CylinderGeometry(1.5, 2, trunkHeight, 8);
    const trunk = new THREE.Mesh(trunkGeometry, materials.palmTrunk);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    treeGroup.add(trunk);
    
    // Leaves
    const leavesGeometry = new THREE.ConeGeometry(8, 20, 8);
    const leaves = new THREE.Mesh(leavesGeometry, materials.palmLeaves);
    leaves.position.y = trunkHeight / 2;
    leaves.castShadow = true;
    treeGroup.add(leaves);
    
    return treeGroup;
}
