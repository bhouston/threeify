import {
  box3Center,
  box3Size,
  Color3,
  Orbit,
  RenderingContext,
  ShaderMaterial,
  Vec3,
  vec3Negate
} from '@threeify/core';
import {
  glTFToSceneNode,
  PerspectiveCamera,
  PointLight,
  renderScene,
  SceneNode,
  SceneTreeCache,
  updateDirtyNodes,
  updateNodeTree,
  updateRenderCache
} from '@threeify/scene';

import { KhronosModels } from '../../KhronosModels';
import { Stats } from '../../Stats';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const containerDivElement = document.getElementById(
    'container'
  ) as HTMLDivElement;
  const stats = new Stats(document);

  containerDivElement.appendChild(stats.dom);

  const shaderMaterial = new ShaderMaterial(vertexSource, fragmentSource);
  const canvasHtmlElement = document.getElementById(
    'framebuffer'
  ) as HTMLCanvasElement;
  const context = new RenderingContext(canvasHtmlElement);
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const orbitController = new Orbit(canvasHtmlElement);
  orbitController.zoom = 0.8;

  const sceneTreeCache = new SceneTreeCache();

  const root = new SceneNode({ name: 'root' });
  const glTFModel = await glTFToSceneNode(KhronosModels.DamagedHelmet);

  updateNodeTree(glTFModel, sceneTreeCache);
  const glTFBoundingBox = glTFModel.subTreeBoundingBox;
  glTFModel.translation = vec3Negate(box3Center(glTFBoundingBox));
  const size = box3Size(glTFBoundingBox);
  const maxSize = Math.max(size.x, size.y, size.z);
  glTFModel.dirty();
  const orbitNode = new SceneNode({
    name: 'orbit',
    translation: new Vec3(0, 0, -2),
    scale: new Vec3(1 / maxSize, 1 / maxSize, 1 / maxSize)
  });
  orbitNode.children.push(glTFModel);
  root.children.push(orbitNode);
  const pointLight1 = new PointLight({
    name: 'PointLight1',
    translation: new Vec3(5, 0, 0),
    color: new Color3(0.7, 0.8, 0.9),
    intensity: 25,
    range: 1000
  });
  root.children.push(pointLight1);
  const pointLight2 = new PointLight({
    name: 'PointLight2',
    translation: new Vec3(-5, 0, 0),
    color: new Color3(1, 0.9, 0.7),
    intensity: 25,
    range: 1000
  });
  root.children.push(pointLight2);
  const pointLight3 = new PointLight({
    name: 'PointLight3',
    translation: new Vec3(0, 5, 0),
    color: new Color3(0.8, 1, 0.7),
    intensity: 25,
    range: 1000
  });
  root.children.push(pointLight3);
  const camera = new PerspectiveCamera({
    name: 'Camera',
    verticalFov: 25,
    near: 0.1,
    far: 1000,
    translation: new Vec3(0, 0, 0)
  });
  root.children.push(camera);

  updateNodeTree(root, sceneTreeCache);

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
    requestAnimationFrame(animate);
    stats.begin();

    canvasFramebuffer.clear();

    orbitController.update();
    orbitNode.rotation = orbitController.rotation;
    camera.zoom = orbitController.zoom;
    camera.dirty();
    orbitNode.dirty();

    updateNodeTree(root, sceneTreeCache);
    updateDirtyNodes(sceneTreeCache, renderCache);
    renderScene(canvasFramebuffer, renderCache);

    stats.end();
  }

  animate();
}

init();
