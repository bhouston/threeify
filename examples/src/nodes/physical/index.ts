import {
  Color3,
  fetchImage,
  icosahedronGeometry,
  PhysicalMaterial,
  RenderingContext,
  ShaderMaterial,
  Texture,
  Vec2,
  Vec3
} from '@threeify/core';
import {
  MeshNode,
  PerspectiveCamera,
  PointLight,
  renderSceneViaSceneCache,
  SceneCache,
  SceneNode,
  sceneToSceneCache,
  updateNodeTree
} from '@threeify/scene';

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

  const geometry = icosahedronGeometry(0.75, 5, true);
  const root = new SceneNode({ name: 'root' });
  const sphereMesh = new MeshNode({
    translation: new Vec3(0, 0, 0),
    geometry,
    material: new PhysicalMaterial({
      albedo: new Color3(1, 1, 1),
      albedoTexture: texture,
      normalScale: new Vec2(-1, -1),
      normalTexture: flooringNormalTexture,
      specularFactor: 0.16,
      specularColor: new Color3(0.5, 0.5, 1),
      specularRoughness: 0.4,
      metallic: 0.5,
      clearcoatFactor: 0.5,
      clearcoatRoughnessFactor: 0.4,
      clearcoatNormalTexture: golfballNormalTexture,
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
  const camera = new PerspectiveCamera(25, 0.1, 4, 1);
  camera.translation.set(0, 0, 3);
  root.children.push(camera);

  updateNodeTree(root, new SceneCache()); // update the node tree (matrices, parents, etc.)

  const sceneCache = sceneToSceneCache(context, root, camera, () => {
    return shaderMaterial;
  });

  function animate(): void {
    canvasFramebuffer.clear();

    renderSceneViaSceneCache(canvasFramebuffer, sceneCache);

    requestAnimationFrame(animate);
  }

  animate();
}

init();
