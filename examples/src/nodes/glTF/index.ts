import {
  Color3,
  quatRotateY,
  quatRotateZ,
  RenderingContext,
  ShaderMaterial,
  Vec3
} from '@threeify/core';
import {
  glTFToSceneNode,
  PerspectiveCamera,
  PointLight,
  renderSceneViaSceneCache,
  SceneNode,
  sceneToSceneCache,
  updateNodeTree
} from '@threeify/scene';

import { KhronosModels } from '../../KhronosModels';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const shaderMaterial = new ShaderMaterial(vertexSource, fragmentSource);
  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const root = new SceneNode({ name: 'root' });
  const glTFModel = await glTFToSceneNode(KhronosModels.DamagedHelmet);
  glTFModel.rotation = quatRotateZ(
    quatRotateY(glTFModel.rotation, Math.PI * 0.25, glTFModel.rotation),
    Math.PI * 0.25,
    glTFModel.rotation
  );
  root.children.push(glTFModel);
  const pointLight = new PointLight({
    translation: new Vec3(5, 5, 5),
    color: new Color3(1, 1, 1),
    intensity: 100,
    range: 1000
  });
  root.children.push(pointLight);
  const camera = new PerspectiveCamera(25, 0.1, 1000, 1);
  camera.translation.set(0, 0, 5);
  root.children.push(camera);

  updateNodeTree(root); // update the node tree (matrices, parents, etc.)

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
