<h1 align="center" style="border-bottom: none;">threeify</h1>
<h3 align="center">A Typescript library loosely based on three.js</h3>
<p align="center">
  <a href="https://www.npmjs.com/package/threeify">
    <img alt="npm latest version" src="https://img.shields.io/npm/v/threeify/latest.svg">
  </a>
  <a href="https://www.npmjs.com/package/threeify">
    <img alt="npm next version" src="https://img.shields.io/npm/v/threeify/next.svg">
  </a>
</p>

**threeify** is a Typescript 3D library loosely based on three.js.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

### Warning

**_In Development, Not Yet Ready for Use of Any Kind_**

This library is currently in alpha and in midst of significant development. It may not even compile properly. You have been warned.

### Usage

This code creates a scene, a camera, and a geometric cube, and it adds the cube to the scene. It then creates a `WebGL` renderer context for the scene and camera, and it adds that viewport to the `document.body` element. Finally, it animates the cube within the scene for the camera.

```typescript
import { box } from "./geometry/primitives/Box";
import { MaterialOutputs } from "./materials/MaterialOutputs";
import { PhysicalMaterial } from "./materials/PhysicalMaterial";
import { PerspectiveCamera } from "./nodes/cameras/PerspectiveCamera";
import { Mesh } from "./nodes/Mesh";
import { Node } from "./nodes/Node";
import { RenderingContext } from "./renderers/webgl2";

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

function animate() {
  requestAnimationFrame(animate);

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;
  mesh.dirty();

  canvasFramebuffer.render(scene, camera, true);
}

animate();
```

### Development

#### Local

To run:

1. Check out the git repository
1. Install node.js & npm as appropriate for your platform.
1. Run npm install to install all the required node modules from package.json

```
yarn
```

3. To run the automatic typescript builder and dev server go:

```
yarn dev
```

Then open a web server to the address displayed in the console. Usually this will be http://localhost:8000.

#### Docker Compose

If you have docker and docker-compose available do:

```
docker-compose up -d
```

#### Theia-IDE

threeify supports the theia-ide so you can start coding immediately. theia-ide is available at http://localhost:3000. Perform step 3 and 4 in the theia-ide terminal.
