import {
  createRenderingContext,
  fetchImage,
  icosahedronGeometry,
  ShaderMaterial,
  shaderMaterialToProgram,
  Texture
} from '@threeify/core';
import { Color3, Vec3 } from '@threeify/math';
import {
  createRenderCache,
  MeshNode,
  PerspectiveCamera,
  PhysicalMaterial,
  PointLight,
  renderScene_Tranmission as renderScene_Tranmission,
  SceneNode,
  SceneTreeCache,
  TextureAccessor,
  updateNodeTree,
  updateRenderCache
} from '@threeify/scene';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const shaderMaterial = new ShaderMaterial(
    'index',
    vertexSource,
    fragmentSource
  );
  const texture = new Texture(
    await fetchImage('/assets/textures/planets/jupiter_2k.jpg')
  );

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());
  const program = await shaderMaterialToProgram(context, shaderMaterial);

  const geometry = icosahedronGeometry(0.75, 5, true);
  const root = new SceneNode({ name: 'root' });
  const sphereMesh = new MeshNode({
    translation: Vec3.Zero,
    geometry,
    material: new PhysicalMaterial({
      albedoFactor: Color3.White,
      albedoAlphaTextureAccessor: new TextureAccessor(texture),
      specularRoughnessFactor: 0,
      metallicFactor: 1
    })
  });
  root.children.push(sphereMesh);
  const pointLight = new PointLight({
    translation: new Vec3(2, 0, 2),
    color: Color3.White,
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

  function animate(): void {
    canvasFramebuffer.clear();

    renderScene_Tranmission(canvasFramebuffer, renderCache);

    requestAnimationFrame(animate);
  }

  animate();
}

init();
