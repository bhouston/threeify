import { box } from "./geometry/Box";
import { MaterialOutputFlags } from "./materials/MaterialOutputFlags";
import { PhysicalMaterial } from "./materials/simple/PhysicalMaterial";
import { Node, Mesh, PerspectiveCamera } from "./nodes";
import { RenderingContext } from "./renderers/webgl2";

const camera = new PerspectiveCamera(70, 0.01, 10);
camera.position.x = 1;

const geometry = box(0.2, 0.2, 0.2);
const material = new PhysicalMaterial();
material.outputs = MaterialOutputFlags.Normal;

const mesh = new Mesh(geometry, material);

const scene = new Node();
scene.children.add(mesh);

const context = new RenderingContext();
const canvasFramebuffer = context.canvasFramebuffer;
document.body.appendChild(canvasFramebuffer.canvas);

function animate() {
  requestAnimationFrame(animate);

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

  canvasFramebuffer.render(scene, camera, true);
}

animate();
