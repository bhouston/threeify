import {
  createRenderingContext,
  fetchTexture,
  icosahedronGeometry,
  ShaderMaterial,
  shaderMaterialToProgram
} from '@threeify/core';
import { Color3, Vec2, Vec3 } from '@threeify/math';
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

import fragmentSource from './fragment.glsl.js';
import vertexSource from './vertex.glsl.js';

async function init(): Promise<void> {
  const shaderMaterial = new ShaderMaterial(
    'index',
    vertexSource,
    fragmentSource
  );
  const texture = await fetchTexture('/assets/textures/planets/jupiter_2k.jpg');
  const flooringNormalTexture = await fetchTexture(
    '/assets/textures/metal_flooring_normals.jpg'
  );
  // const _scratchesTexture = await fetchTexture(
  // '/assets/textures/golfball/scratches.png'
  //);
  const golfballNormalTexture = await fetchTexture(
    '/assets/textures/golfball/normals2.jpg'
  );

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());
  const program = await shaderMaterialToProgram(context, shaderMaterial);

  const sceneTreeCache = new SceneTreeCache();
  const geometry = icosahedronGeometry(0.75, 5, true);
  const root = new SceneNode({ name: 'root' });
  const sphereMesh = new MeshNode({
    translation: Vec3.Zero,
    geometry,
    material: new PhysicalMaterial({
      albedoFactor: Color3.White,
      albedoAlphaTextureAccessor: new TextureAccessor(texture),
      normalScale: new Vec2(-1, -1),
      normalTextureAccessor: new TextureAccessor(flooringNormalTexture),
      specularFactor: 0.16,
      specularColor: new Color3(0.5, 0.5, 1),
      specularRoughnessFactor: 0.4,
      metallicFactor: 0.5,
      clearcoatFactor: 0.5,
      clearcoatRoughnessFactor: 0.4,
      clearcoatNormalTextureAccessor: new TextureAccessor(
        golfballNormalTexture
      ),
      clearcoatTint: new Color3(0.5, 0.2, 0),
      sheenColorFactor: new Color3(1, 0.2, 0.8),
      sheenRoughnessFactor: 0.5
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
    zoom: 1
  });
  camera.translation.set(0, 0, 3);
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

  function animate(): void {
    canvasFramebuffer.clear();

    renderScene(canvasFramebuffer, renderCache);

    requestAnimationFrame(animate);
  }

  animate();
}

init();
