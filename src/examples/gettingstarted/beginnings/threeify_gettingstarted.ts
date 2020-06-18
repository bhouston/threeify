import { box } from "../../../lib/geometry/primitives/Box";
import { MaterialOutputs } from "../../../lib/materials/MaterialOutputs";
import { PhysicalMaterial } from "../../../lib/materials/PhysicalMaterial";
import { PerspectiveCamera } from "../../../lib/nodes/cameras/PerspectiveCamera";
import { Mesh } from "../../../lib/nodes/Mesh";
import { Node } from "../../../lib/nodes/Node";
import { RenderingContext } from "../../../lib/renderers/webgl2/RenderingContext";

const camera = new PerspectiveCamera(70, 0.01, 10);
camera.position.x = 1;

const geometry = box(0.2, 0.2, 0.2);
const material = new PhysicalMaterial();
material.outputs = MaterialOutputs.Normal;

const mesh = new Mesh(geometry, material);

const scene = new Node();
scene.children.add(mesh);

const context = new RenderingContext();
const canvasFramebuffer = context.canvasFramebuffer;
document.body.appendChild(canvasFramebuffer.canvas);

function animate(): void {
  requestAnimationFrame(animate);

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;
  mesh.dirty();

  canvasFramebuffer.render(scene, camera, true);
}

animate();
