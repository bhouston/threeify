import {
  ShaderMaterial,
  Texture,
  fetchImage,
  RenderingContext,
  icosahedronGeometry,
  Vec3,
  PhysicalMaterial,
  Color3,
  DepthTestState,
  ClearState,
  CullingState
} from '@threeify/core';
import {
  SceneNode,
  PointLight,
  PerspectiveCamera,
  updateNodeTree,
  sceneToSceneCache,
  renderSceneViaSceneCache,
  MeshNode
} from '@threeify/scene';
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

  const geometry = icosahedronGeometry(0.75, 5, true);
  const root = new SceneNode({ name: 'root' });
  const sphereMesh = new MeshNode({
    translation: new Vec3(0, 0, 0),
    geometry,
    material: new PhysicalMaterial({
      albedo: new Color3(1, 1, 1),
      albedoTexture: texture,
      specularRoughness: 0,
      metallic: 1
    })
  });
  root.children.push(sphereMesh);
  const pointLight = new PointLight({
    translation: new Vec3(2, 0, 2),
    color: new Color3(1, 1, 1),
    intensity: 10,
    range: 20
  });

  root.children.push(pointLight);
  const camera = new PerspectiveCamera(25, 0.1, 4, 1);
  camera.translation.set(0, 0, 3);
  root.children.push(camera);

  updateNodeTree(root); // update the node tree (matrices, parents, etc.)

  const sceneCache = sceneToSceneCache(context, root, camera, () => {
    return shaderMaterial;
  });

  canvasFramebuffer.depthTestState = DepthTestState.Default;
  canvasFramebuffer.clearState = ClearState.Black;
  canvasFramebuffer.cullingState = new CullingState(true);

  function animate(): void {
    canvasFramebuffer.clear();

    renderSceneViaSceneCache(canvasFramebuffer, sceneCache);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
