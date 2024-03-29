import {
  createRenderingContext,
  DepthTestFunc,
  DepthTestState,
  fetchTexture,
  icosahedronGeometry,
  shaderSourceToProgram
} from '@threeify/core';
import { Color3, Euler3, euler3ToQuat, Vec3 } from '@threeify/math';
import {
  createRenderCache,
  MeshNode,
  PerspectiveCamera,
  PhysicalMaterial,
  PointLight,
  renderScene,
  SceneNode,
  SceneTreeCache,
  TextureAccessor,
  updateNodeTree,
  updateRenderCache
} from '@threeify/scene';

import { Stats } from '../../utilities/Stats.js';
import fragmentSource from './fragment.glsl.js';
import vertexSource from './vertex.glsl.js';

const stats = new Stats();

async function init(): Promise<void> {
  const texture = await fetchTexture('/assets/textures/planets/jupiter_2k.jpg');

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());
  const program = await shaderSourceToProgram(
    context,
    'index',
    vertexSource,
    fragmentSource
  );

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
        albedoFactor: new Color3(Math.random(), Math.random(), Math.random()),
        albedoAlphaTextureAccessor: new TextureAccessor(texture),
        specularRoughnessFactor: Math.random(),
        metallicFactor: Math.random()
      })
    });
    root.children.push(sphereMesh);
  }

  const directionalLight = new PointLight({
    translation: Vec3.Zero,
    color: Color3.White,
    intensity: 10
  });
  root.children.push(directionalLight);

  const camera = new PerspectiveCamera({
    verticalFov: 25,
    near: 0.1,
    far: 4,
    translation: new Vec3(0, 0, 3)
  });
  root.children.push(camera);

  updateNodeTree(root, sceneTreeCache); // update the node tree (matrices, parents, etc.)
  const renderCache = await createRenderCache(context);
  updateRenderCache(
    context,
    root,
    camera,
    () => {
      return program;
    },
    sceneTreeCache,
    renderCache
  );

  canvasFramebuffer.depthTestState = new DepthTestState(
    true,
    DepthTestFunc.LessOrEqual
  );

  function animate(): void {
    requestAnimationFrame(animate);
    stats.time(() => {
      canvasFramebuffer.clear();

      renderScene(canvasFramebuffer, renderCache);
    });
  }

  animate();
}

init();
