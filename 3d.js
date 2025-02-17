// Create Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create WebGLRenderer
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Set the canvas size dynamically
renderer.setSize(window.innerWidth, window.innerHeight);

// Set tone mapping and encoding
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1; // Increase brightness
renderer.outputEncoding = THREE.sRGBEncoding;

// Append renderer's canvas to the #canvas-container div
document.getElementById("canvas-container").appendChild(renderer.domElement);

// Add Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth rotation
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 2; // Minimum zoom
controls.maxDistance = 10; // Maximum zoom

// Load HDRI Environment
const rgbeLoader = new THREE.RGBELoader();
rgbeLoader.load("./parkingLot2.hdr", function (texture) {
  // Replace with HDRI file path
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace; // Gamma correction
  scene.environment = texture;
  scene.background = texture;
});

let model;

// Load 3D Model
const loader = new THREE.GLTFLoader();
loader.load(
  "./car2.glb", // Replace with your GLB/GLTF file URL
  function (gltf) {
    model = gltf.scene;
    scene.add(model);
    model.position.set(0, 0, 0);
    model.scale.set(2.1, 2.1, 2.1);
    model.rotation.y = -1;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".section_one",
        markers: true,
        scrub: true,
        start: "top top", // Starts when the top of section_one reaches the top of the viewport
        end: "bottom bottom", // Ends when the bottom of section_one reaches the top of the viewport
      },
    });

    tl.to(
      camera.position,
      {
        x: 1,
        y: 1,
        z: -0.6,
        duration: 5,
      },
      "one"
    );
    // .to(
    //   camera.position,
    //   {
    //     x: -1.5,
    //     y: 2,
    //     z: 3.76,
    //     duration: 5,
    //   },
    //   "two"
    // );

    // On button click
    // document.getElementById("moveCameraButton").addEventListener("click", () => {
    //   gsap.to(camera.position, {
    //     x: 1,
    //     y: 1,
    //     z: -0.6,
    //     duration: 2,
    //     ease: "power2.inOut",
    //   });

    //   gsap.to(camera.rotation, {
    //     onUpdate: () => camera.lookAt(model.position),
    //   });
    // });
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error("Error loading model:", error);
  }
);

// Set Camera Position
camera.position.set(0, 2, 5);
// camera.position.set(1, 1, -0.6);
camera.rotation.set(0, 0, 0);
if (model) {
  camera.lookAt(model);
}
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

// Add a ground plane to catch shadows
const groundGeometry = new THREE.PlaneGeometry(10, 10);
const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.5 }); // Shadow effect
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Lay flat
ground.position.set(0, 0, 0); // Adjust to be slightly below the car
ground.receiveShadow = true;
scene.add(ground);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  if (model) {
    camera.lookAt(model.position); // Ensure camera is always looking at the model
  }
  controls.update(); // Required for damping effect
  renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows

// Lights
const directionalLight = new THREE.DirectionalLight("white", 1);
directionalLight.position.set(5, 2, 0);
scene.add(directionalLight);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.5);
scene.add(directionalLightHelper);
const axesHelper = new THREE.AxesHelper(1); // Size 1
directionalLight.add(axesHelper); // Attach AxesHelper to the light

const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color("white");
ambientLight.intensity = 0.4;
scene.add(ambientLight);

// Import dat.GUI (Make sure to include it in your project)
const gui = new dat.GUI();

// GUI Controls
const lightFolder = gui.addFolder("Directional Light");
lightFolder.add(directionalLight.position, "x", -10, 10).name("Position X");
lightFolder.add(directionalLight.position, "y", -10, 10).name("Position Y");
lightFolder.add(directionalLight.position, "z", -10, 10).name("Position Z");
lightFolder.add(directionalLight.rotation, "x", -10, 10).name("Rotation X");
lightFolder.add(directionalLight.rotation, "y", -10, 10).name("Rotation Y");
lightFolder.add(directionalLight.rotation, "z", -10, 10).name("Rotation Z");

lightFolder.add(directionalLight, "intensity", 0, 5).name("Intensity");
lightFolder
  .addColor({ color: "#ffffff" }, "color")
  .name("Color")
  .onChange((value) => {
    directionalLight.color.set(value);
  });

lightFolder.open(); // Keep GUI open by default

const cameraFolder = gui.addFolder("Camera Controls");

// Control Camera Position
cameraFolder.add(camera.position, "x", -10, 10).name("Position X");
cameraFolder.add(camera.position, "y", -10, 10).name("Position Y");
cameraFolder.add(camera.position, "z", -10, 10).name("Position Z");

// Control Camera Rotation
cameraFolder.add(camera.rotation, "x", -Math.PI, Math.PI).name("Rotation X");
cameraFolder.add(camera.rotation, "y", -Math.PI, Math.PI).name("Rotation Y");
cameraFolder.add(camera.rotation, "z", -Math.PI, Math.PI).name("Rotation Z");

// Control Camera Field of View (FOV)
cameraFolder
  .add(camera, "fov", 1, 120)
  .name("Field of View")
  .onChange(() => {
    camera.updateProjectionMatrix(); // Update camera after changing FOV
  });

cameraFolder.open(); // Open the Camera Controls by default
