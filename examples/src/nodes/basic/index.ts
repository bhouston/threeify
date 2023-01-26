import {
  Color3,
  fetchImage,
  icosahedronGeometry,
  PhysicalMaterial,
  RenderingContext,
  ShaderMaterial,
  Texture,
  Vec3
} from '@threeify/core';
import {
  MeshNode,
  PerspectiveCamera,
  PointLight,
  renderScene as renderScene,
  SceneNode,
  SceneTreeCache,
  updateNodeTree,
  updateRenderCache
} from '@threeify/scene';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
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
      albedoFactor: new Color3(1, 1, 1),
      albedoTexture: texture,
      specularRoughnessFactor: 0,
      metallicFactor: 1
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
  const camera = new PerspectiveCamera({
    verticalFov: 25,
    near: 0.1,
    far: 4,
    zoom: 1,
    translation: new Vec3(0, 0, 3)
  });
  root.children.push(camera);

  const sceneTreeCache = new SceneTreeCache();
  updateNodeTree(root, sceneTreeCache); // update the node tree (matrices, parents, etc.)

  const renderCache = updateRenderCache(
    context,
    root,
    camera,
    () => {
      return shaderMaterial;
    },
    sceneTreeCache
  );

  function animate(): void {
    canvasFramebuffer.clear();

    renderScene(canvasFramebuffer, renderCache);

    requestAnimationFrame(animate);
  }

  animate();
}

init();
