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
  renderScene,
  SceneNode,
  SceneTreeCache,
  updateDirtyNodes,
  updateNodeTree,
  updateRenderCache
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

  const sceneTreeCache = new SceneTreeCache();

  const root = new SceneNode({ name: 'root' });
  const glTFModel = await glTFToSceneNode(KhronosModels.DamagedHelmet);

  updateNodeTree(glTFModel, sceneTreeCache);
  const glTFBoundingBox = glTFModel.subTreeBoundingBox;
  //console.log(glTFBoundingBox.clone());
  glTFModel.translation = vec3Negate(box3Center(glTFBoundingBox));
  glTFModel.scale = vec3Reciprocal(box3Size(glTFBoundingBox));
  glTFModel.dirty();
  const orbitNode = new SceneNode({
    name: 'orbit',
    translation: new Vec3(0, 0, -3)
  });
  orbitNode.children.push(glTFModel);
  root.children.push(orbitNode);
  const pointLight = new PointLight({
    name: 'PointLight',
    translation: new Vec3(10, 0, 0),
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
    zoom: 1,
    translation: new Vec3(0, 0, 30)
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
    canvasFramebuffer.clear();

    orbitController.update();
    orbitNode.rotation = orbitController.rotation;
    orbitNode.dirty();

    updateNodeTree(root, sceneTreeCache);
    updateDirtyNodes(sceneTreeCache, renderCache);
    renderScene(canvasFramebuffer, renderCache);

    requestAnimationFrame(animate);
  }

  animate();
}

init();
