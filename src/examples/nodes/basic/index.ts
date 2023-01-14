import { sceneToSceneCache } from '../../../lib/engines/sceneCache/compiling.js';
import { renderSceneViaSceneCache } from '../../../lib/engines/sceneCache/rendering.js';
import { updateNodeTree } from '../../../lib/engines/sceneCache/updating.js';
import {
  BufferBit,
  ClearState,
  Color3,
  color3MultiplyByScalar,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  fetchImage,
  icosahedronGeometry,
  KhronosPhysicalMaterial,
  Mesh,
  PerspectiveCamera,
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

  const root = new SceneNode({ name: 'root' });
  const sphereMesh = new Mesh({
    position: new Vec3(0, 0, 0),
    geometry: icosahedronGeometry(0.75, 5),
    material: new KhronosPhysicalMaterial({
      albedo: new Color3(1, 1, 1),
      albedoTexture: texture,
      roughness: 0.5,
      metallic: 0.5
    })
  });
  root.children.push(sphereMesh);
  const pointLight = new SpotLight({
    position: new Vec3(1, 0, -0.5),
    color: color3MultiplyByScalar(new Color3(1, 1, 1), 1000)
  });
  root.children.push(pointLight);
  const camera = new PerspectiveCamera(45, 0.1, 4, 1);
  camera.position.set(0, 0, -3);
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

    renderSceneViaSceneCache(canvasFramebuffer, root, sceneCache);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
