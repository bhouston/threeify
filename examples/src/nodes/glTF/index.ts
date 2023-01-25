import {
  Color3,
  Orbit,
  RenderingContext,
  ShaderMaterial,
  Vec3
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
import Stats from '../../Stats.js';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const stats = new Stats();
  const containerDivElement = document.getElementById(
    'container'
  ) as HTMLDivElement;
  containerDivElement.appendChild(stats.dom);

  const shaderMaterial = new ShaderMaterial(vertexSource, fragmentSource);
  const canvasHtmlElement = document.getElementById(
    'framebuffer'
  ) as HTMLCanvasElement;
  const context = new RenderingContext(canvasHtmlElement);
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const orbitController = new Orbit(canvasHtmlElement);
  orbitController.zoom = 1;

  const sceneTreeCache = new SceneTreeCache();

  const root = new SceneNode({ name: 'root' });
  const glTFModel = await glTFToSceneNode(KhronosModels.DamagedHelmet);

  updateNodeTree(glTFModel, sceneTreeCache);
  //const glTFBoundingBox = glTFModel.subTreeBoundingBox;
  //console.log(glTFBoundingBox.clone());
  //glTFModel.translation = vec3Negate(box3Center(glTFBoundingBox));
  //glTFModel.scale = vec3Reciprocal(box3Size(glTFBoundingBox));
  glTFModel.dirty();
  const orbitNode = new SceneNode({
    name: 'orbit',
    translation: new Vec3(0, 0, -5)
  });
  orbitNode.children.push(glTFModel);
  root.children.push(orbitNode);
  const pointLight = new PointLight({
    name: 'PointLight',
    translation: new Vec3(5, 0, 5),
    color: new Color3(1, 1, 1),
    intensity: 30,
    range: 1000
  });
  root.children.push(pointLight);
  const camera = new PerspectiveCamera({
    name: 'Camera',
    verticalFov: 25,
    near: 0.1,
    far: 1000,
    translation: new Vec3(0, 0, 0)
  });
  root.children.push(camera);

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

    canvasFramebuffer.clear();

    orbitController.update();
    orbitNode.rotation = orbitController.rotation;
    camera.zoom = orbitController.zoom;
    camera.dirty();
    orbitNode.dirty();

    updateNodeTree(root, sceneTreeCache);
    updateDirtyNodes(sceneTreeCache, renderCache);
    renderScene(canvasFramebuffer, renderCache);

    stats.update();
  }

  animate();
}

init();
