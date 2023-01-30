import {
  fetchImage,
  icosahedronGeometry,
  PhysicalMaterial,
  RenderingContext,
  ShaderMaterial,
  Texture,
  TextureAccessor
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
import { Color3, Vec2, Vec3 } from '@threeify/vector-math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const shaderMaterial = new ShaderMaterial(vertexSource, fragmentSource);
  const texture = new Texture(
    await fetchImage('/assets/textures/planets/jupiter_2k.jpg')
  );
  const flooringNormalTexture = new Texture(
    await fetchImage('/assets/textures/metal_flooring_normals.jpg')
  );
  const scratchesTexture = new Texture(
    await fetchImage('/assets/textures/golfball/scratches.png')
  );
  const golfballNormalTexture = new Texture(
    await fetchImage('/assets/textures/golfball/normals2.jpg')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const sceneTreeCache = new SceneTreeCache();
  const geometry = icosahedronGeometry(0.75, 5, true);
  const root = new SceneNode({ name: 'root' });
  const sphereMesh = new MeshNode({
    translation: new Vec3(0, 0, 0),
    geometry,
    material: new PhysicalMaterial({
      albedoFactor: new Color3(1, 1, 1),
      albedoTextureAccessor: new TextureAccessor(texture),
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
    color: new Color3(1, 1, 1),
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
