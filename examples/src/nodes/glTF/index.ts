import {
  box3Center,
  box3Size,
  Color3,
  Orbit,
  RenderingContext,
  ShaderMaterial,
  Vec3,
  vec3Negate,
  vec3Reciprocal
} from '@threeify/core';
import {
  glTFToSceneNode,
  PerspectiveCamera,
  PointLight,
  renderSceneViaSceneCache,
  SceneNode,
  sceneToSceneCache,
  updateDirtyNodes,
  updateNodeTree
} from '@threeify/scene';

import { KhronosModels } from '../../KhronosModels';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const shaderMaterial = new ShaderMaterial(vertexSource, fragmentSource);
  const canvasHtmlElement = document.getElementById(
    'framebuffer'
  ) as HTMLCanvasElement;
  const context = new RenderingContext(canvasHtmlElement);
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const orbitController = new Orbit(canvasHtmlElement);

  const root = new SceneNode({ name: 'root' });
  const glTFModel = await glTFToSceneNode(KhronosModels.DamagedHelmet);
  updateNodeTree(glTFModel);
  const glTFBoundingBox = glTFModel.subTreeBoundingBox;
  //console.log(glTFBoundingBox.clone());
  glTFModel.translation = vec3Negate(box3Center(glTFBoundingBox));
  glTFModel.scale = vec3Reciprocal(box3Size(glTFBoundingBox));
  const orbitNode = new SceneNode({
    name: 'orbit',
    translation: new Vec3(0, 0, -3)
  });
  orbitNode.children.push(glTFModel);
  root.children.push(orbitNode);
  const pointLight = new PointLight({
    translation: new Vec3(10, 0, 0),
    color: new Color3(1, 1, 1),
    intensity: 30,
    range: 1000
  });
  root.children.push(pointLight);
  const camera = new PerspectiveCamera(25, 0.1, 1000, 1);
  camera.translation.set(0, 0, 30);
  root.children.push(camera);

  const sceneCache = sceneToSceneCache(context, root, camera, () => {
    return shaderMaterial;
  });

  function animate(): void {
    canvasFramebuffer.clear();

    orbitController.update();
    orbitNode.rotation = orbitController.rotation;
    orbitNode.dirty();

    updateNodeTree(root);
    updateDirtyNodes(sceneCache);
    renderSceneViaSceneCache(canvasFramebuffer, sceneCache);

    requestAnimationFrame(animate);
  }

  animate();
}

init();
