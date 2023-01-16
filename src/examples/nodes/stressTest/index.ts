import { sceneToSceneCache } from '../../../lib/engines/sceneCache/compiling.js';
import { renderSceneViaSceneCache } from '../../../lib/engines/sceneCache/rendering.js';
import { updateNodeTree } from '../../../lib/engines/sceneCache/updating.js';
import {
  BufferBit,
  ClearState,
  Color3,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  Euler3,
  euler3ToQuat,
  fetchImage,
  icosahedronGeometry,
  Mesh,
  PerspectiveCamera,
  PhysicalMaterial,
  RenderingContext,
  SceneNode,
  ShaderMaterial,
  SpotLight,
  Texture,
  Vec3
} from '../../../lib/index.js';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const shaderMaterial = new ShaderMaterial(vertexSource, fragmentSource);
  const texture = new Texture(
    await fetchImage('/assets/textures/planets/jupiter_2k.jpg')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const geometry = icosahedronGeometry(0.1, 5, true);
  const root = new SceneNode({ name: 'root' });
  for (let i = 0; i < 100; i++) {
    const sphereMesh = new Mesh({
      position: new Vec3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ),
      rotation: euler3ToQuat(
        new Euler3(Math.random() * 6, Math.random() * 6, Math.random() * 6)
      ),
      geometry,
      material: new PhysicalMaterial({
        albedo: new Color3(Math.random(), Math.random(), Math.random()),
        albedoTexture: texture,
        specularRoughness: Math.random(),
        metallic: Math.random()
      })
    });
    root.children.push(sphereMesh);
  }
  const pointLight = new SpotLight({
    position: new Vec3(1, 0, -0.5),
    color: new Color3(0, 0, 1),
    intensity: 100,
    range: 6
  });
  root.children.push(pointLight);
  const pointLight2 = new SpotLight({
    position: new Vec3(-1, 0, -0.5),
    color: new Color3(1, 0, 0),
    intensity: 100,
    range: 6
  });
  root.children.push(pointLight2);
  const camera = new PerspectiveCamera(25, 0.1, 4, 1);
  camera.position.set(0, 0, 3);
  root.children.push(camera);

  updateNodeTree(root); // update the node tree (matrices, parents, etc.)

  const sceneCache = sceneToSceneCache(context, root, camera, () => {
    return shaderMaterial;
  });

  canvasFramebuffer.depthTestState = new DepthTestState(
    true,
    DepthTestFunc.Less
  );
  canvasFramebuffer.clearState = new ClearState(new Color3(0, 0, 0), 1);
  canvasFramebuffer.cullingState = new CullingState(true);

  function animate(): void {
    canvasFramebuffer.clear(BufferBit.All);

    renderSceneViaSceneCache(canvasFramebuffer, sceneCache);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
