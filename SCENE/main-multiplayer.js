import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color("#0b2a3d");
scene.fog = new THREE.FogExp2(0x110011, 0.035);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.setScissorTest(true);
document.body.appendChild(renderer.domElement);

const gltfLoader = new GLTFLoader();

const player1 = new THREE.Object3D();
const player2 = new THREE.Object3D();
player1.position.set(2, 1, 2);
player2.position.set(0, 1, 2);
player1.rotation.y = Math.PI;
player2.rotation.y = Math.PI;
scene.add(player1);
scene.add(player2);

const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
camera1.position.set(0, 0.6, 2);
camera2.position.set(0, 0.6, 2);
player1.add(camera1);
player2.add(camera2);

function addGunToCamera(camera, owner) {
  gltfLoader.load("/modelos/ak-a4_gun_model.glb", (glb) => {
    const gun = glb.scene;
    gun.scale.set(0.01, 0.01, 0.01);
    gun.position.set(0.2, -0.3, -0.5);
    gun.rotation.set(0, Math.PI, 0);

    if (owner === "player1") {
      camera1.add(gun);
      camera1.userData.gun = gun;
    } else if (owner === "player2") {
      camera2.add(gun);
      camera2.userData.gun = gun;
    }
  });
}
addGunToCamera(camera1, "player1");
addGunToCamera(camera2, "player2");

gltfLoader.load("/modelos/Escenario1/Escenarios.glb", glb => {
  const obj = glb.scene;
  obj.scale.set(1, 1, 1);
  obj.position.set(0, 0, 0);
  obj.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(obj);
});

scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 3));
scene.add(new THREE.AmbientLight(0xffffff, 0.9));
scene.add(new THREE.DirectionalLight(0xffffff, 3));

const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

const bullets1 = [], bullets2 = [], enemies = [];
let kills1 = 0, kills2 = 0, vida1 = 100, vida2 = 100;

function shoot(player, camera, bullets) {
  const bullet = new THREE.Mesh(
    new THREE.SphereGeometry(0.05),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  const gun = camera.userData.gun;
  const worldPos = new THREE.Vector3();
  if (gun) gun.getWorldPosition(worldPos);
  else player.getWorldPosition(worldPos);
  bullet.position.copy(worldPos);
  bullet.userData.velocity = new THREE.Vector3(
    -Math.sin(player.rotation.y), 0, -Math.cos(player.rotation.y)
  ).multiplyScalar(0.7);
  scene.add(bullet);
  bullets.push(bullet);
}

function updateBullets(bullets, playerID) {
  bullets.forEach((b, i) => {
    b.position.add(b.userData.velocity);
    enemies.forEach((enemy, ei) => {
      if (b.position.distanceTo(enemy.position) < 1.2) {
        scene.remove(enemy);
        enemies.splice(ei, 1);
        scene.remove(b);
        bullets.splice(i, 1);
        playerID === 1 ? kills1++ : kills2++;
        updateHUD();
      }
    });
  });
}

function updateHUD() {
  const hud = document.getElementById("hud");
  if (hud) {
    hud.textContent = `Kills P1: ${kills1} | Vida P1: ${vida1.toFixed(0)} | Kills P2: ${kills2} | Vida P2: ${vida2.toFixed(0)}`;
  }
}

function spawnEnemy() {
  gltfLoader.load("/modelos/half-life_headcrab_zombie.glb", glb => {
    const enemy = glb.scene;
    enemy.scale.set(0.07, 0.07, 0.07);
    const z = 30 + Math.random() * 20;
    const x = (Math.random() - 0.5) * 30;
    enemy.position.set(x, 0, z);
    scene.add(enemy);
    enemies.push(enemy);
  });
}
setInterval(spawnEnemy, 5000);

function animate() {
  requestAnimationFrame(animate);

  // Controles de jugador 1
  if (keys['w']) player1.position.z += 0.1;
  if (keys['s']) player1.position.z -= 0.1;
  if (keys['a']) player1.position.x += 0.1;
  if (keys['d']) player1.position.x -= 0.1;
  if (keys['q']) player1.rotation.y += 0.05;
  if (keys['e']) player1.rotation.y -= 0.05;
  if (keys[' ']) shoot(player1, camera1, bullets1), keys[' '] = false;

  // Controles de jugador 2
  if (keys['ArrowUp']) player2.position.z += 0.1;
  if (keys['ArrowDown']) player2.position.z -= 0.1;
  if (keys['ArrowLeft']) player2.position.x += 0.1;
  if (keys['ArrowRight']) player2.position.x -= 0.1;
  if (keys[',']) player2.rotation.y += 0.05;
  if (keys['.']) player2.rotation.y -= 0.05;
  if (keys['Enter']) shoot(player2, camera2, bullets2), keys['Enter'] = false;

  updateBullets(bullets1, 1);
  updateBullets(bullets2, 2);

  enemies.forEach(enemy => {
    const d1 = enemy.position.distanceTo(player1.position);
    const d2 = enemy.position.distanceTo(player2.position);
    const target = d1 < d2 ? player1 : player2;
    const direction = new THREE.Vector3().subVectors(target.position, enemy.position).normalize();
    enemy.position.addScaledVector(direction, 0.05);
    if (d1 < 1.5) vida1 -= 0.1;
    if (d2 < 1.5) vida2 -= 0.1;
  });

  updateHUD();

  const w = window.innerWidth, h = window.innerHeight;
  renderer.setViewport(0, 0, w / 2, h);
  renderer.setScissor(0, 0, w / 2, h);
  renderer.render(scene, camera1);

  renderer.setViewport(w / 2, 0, w / 2, h);
  renderer.setScissor(w / 2, 0, w / 2, h);
  renderer.render(scene, camera2);
}
animate();

window.addEventListener('resize', () => {
  const aspect = window.innerWidth / 2 / window.innerHeight;
  camera1.aspect = aspect;
  camera2.aspect = aspect;
  camera1.updateProjectionMatrix();
  camera2.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
