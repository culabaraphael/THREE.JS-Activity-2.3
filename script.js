// Set up the scene, camera, renderer, and texture loader
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#scene') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a texture loader
const textureLoader = new THREE.TextureLoader();

// Ambient and moon lights
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
moonLight.position.set(5, 5, 5);
scene.add(moonLight);

// Fog
const fog = new THREE.Fog('#262837', 1, 15);
scene.fog = fog;
renderer.setClearColor('#262837');

// House container
const house = new THREE.Group();
scene.add(house);

// Create the house walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ color: '#ac8e82' })
);
walls.position.y = 1.25;
house.add(walls);

// Create the roof (pyramid shape)
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 2.5 + 0.5;
house.add(roof);

// Create the door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load('/textures/door/color.jpg'),
        transparent: true,
        alphaMap: textureLoader.load('/textures/door/alpha.jpg'),
        aoMap: textureLoader.load('/textures/door/ambientOcclusion.jpg'),
        displacementMap: textureLoader.load('/textures/door/height.jpg'),
        displacementScale: 0.1,
        normalMap: textureLoader.load('/textures/door/normal.jpg'),
        metalnessMap: textureLoader.load('/textures/door/metalness.jpg'),
        roughnessMap: textureLoader.load('/textures/door/roughness.jpg')
    })
);
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2));
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Create bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
house.add(bush1, bush2, bush3, bush4);

// Create graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.set(x, 0.3, z);
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    graves.add(grave);
}

// Create ghost lights
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
scene.add(ghost1);
const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
scene.add(ghost2);
const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
scene.add(ghost3);

// Set up shadows
renderer.shadowMap.enabled = true;
moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

// Animate the ghosts
const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Animate ghosts
    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(elapsedTime * 3);

    const ghost2Angle = -elapsedTime * 0.32;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    const ghost3Angle = -elapsedTime * 0.18;
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

// Adjust camera position and start animation
camera.position.set(0, 2, 7);
tick();
