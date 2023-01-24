import {
  Color3,
  DepthTestFunc,
  DepthTestState,
  Euler3,
  euler3ToQuat,
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
  renderScene,
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

  const sceneTreeCache = new SceneTreeCache();

  const geometry = icosahedronGeometry(0.1, 5, true);
  const root = new SceneNode({ name: 'root' });
  for (let i = 0; i < 1000; i++) {
    const sphereMesh = new MeshNode({
      translation: new Vec3(
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

  const directionalLight = new PointLight({
    translation: new Vec3(0, 0, 0),
    color: new Color3(1, 1, 1),
    intensity: 10
  });
  root.children.push(directionalLight);

  const camera = new PerspectiveCamera(25, 0.1, 4, 1);
  camera.translation.set(0, 0, 3);
  root.children.push(camera);

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

  canvasFramebuffer.depthTestState = new DepthTestState(
    true,
    DepthTestFunc.LessOrEqual
  );

  function animate(): void {
    canvasFramebuffer.clear();

    renderScene(canvasFramebuffer, renderCache);

    requestAnimationFrame(animate);
  }

  animate();
}

init();
