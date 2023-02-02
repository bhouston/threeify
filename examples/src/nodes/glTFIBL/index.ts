import {
  Blending,
  blendModeToBlendState,
  fetchHDR,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromEquirectangularTexture,
  Orbit,
  passGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture
} from '@threeify/core';
import {
  DomeLight,
  glTFToSceneNode,
  PerspectiveCamera,
  PointLight,
  renderScene,
  SceneNode,
  SceneTreeCache,
  subTreeStats,
  updateDirtyNodes,
  updateNodeTree,
  updateRenderCache
} from '@threeify/scene';
import {
  box3Center,
  box3MaxSize,
  Color3,
  Mat4,
  mat4Inverse,
  mat4PerspectiveFov,
  quatToMat4,
  Vec2,
  Vec3,
  vec3Negate
} from '@threeify/vector-math';

import {
  getKhronosGlTFUrl,
  GLTFFormat,
  KhronosModel
} from '../../khronosModels';
import { getThreeJSHDRIUrl, ThreeJSHRDI } from '../../threejsHDRIs';
import backgroundFragmentSource from './background/fragment.glsl';
import backgroundVertexSource from './background/vertex.glsl';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';
//const stats = new Stats();

async function init(): Promise<void> {
  const backgroundGeometry = passGeometry();
  const backgroundMaterial = new ShaderMaterial(
    backgroundVertexSource,
    backgroundFragmentSource
  );

  const shaderMaterial = new ShaderMaterial(vertexSource, fragmentSource);
  console.time('fetchHDR');
  const latLongTexture = new Texture(
    await fetchHDR(getThreeJSHDRIUrl(ThreeJSHRDI.royal_esplanade_1k))
  );
  console.timeEnd('fetchHDR');
  const lightIntensity = 0;
  const domeLightIntensity = 1;

  const glTFModel = await glTFToSceneNode(
    getKhronosGlTFUrl(KhronosModel.DamagedHelmet, GLTFFormat.glTF)
  );

  const canvasHtmlElement = document.getElementById(
    'framebuffer'
  ) as HTMLCanvasElement;
  const context = new RenderingContext(canvasHtmlElement);
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  console.time('makeTexImage2DFromEquirectangularTexture');
  const cubeMap = makeTexImage2DFromEquirectangularTexture(
    context,
    latLongTexture,
    new Vec2(1024, 1024)
  );
  console.timeEnd('makeTexImage2DFromEquirectangularTexture');

  const orbitController = new Orbit(canvasHtmlElement);
  orbitController.zoom = 1.2;

  const sceneTreeCache = new SceneTreeCache();

  const root = new SceneNode({ name: 'root' });
  console.time('glTFToSceneNode');

  console.timeEnd('glTFToSceneNode');

  console.time('updateNodeTree');
  updateNodeTree(glTFModel, sceneTreeCache);
  console.timeEnd('updateNodeTree');

  const glTFBoundingBox = glTFModel.subTreeBoundingBox;
  glTFModel.translation = vec3Negate(box3Center(glTFBoundingBox));
  glTFModel.dirty();
  const maxSize = box3MaxSize(glTFBoundingBox);

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
    color: new Color3(0.6, 0.8, 1),
    intensity: lightIntensity * 50,
    range: 1000
  });
  root.children.push(pointLight1);
  const pointLight2 = new PointLight({
    name: 'PointLight2',
    translation: new Vec3(-5, 0, 0),
    color: new Color3(1, 0.9, 0.7),
    intensity: lightIntensity * 50,
    range: 1000
  });
  root.children.push(pointLight2);
  const pointLight3 = new PointLight({
    name: 'PointLight3',
    translation: new Vec3(0, 5, 0),
    color: new Color3(0.8, 1, 0.7),
    intensity: lightIntensity * 50,
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
  const domeLight = new DomeLight({
    name: 'DomeLight',
    cubeMap: cubeMap,
    translation: orbitNode.translation,
    color: new Color3(1, 1, 1),
    intensity: domeLightIntensity
  });
  root.children.push(domeLight);

  updateNodeTree(root, sceneTreeCache);

  const treeStats = subTreeStats(root);

  console.log(`Subtree stats: ${JSON.stringify(treeStats, null, 2)}`);

  console.time('updateRenderCache');
  const renderCache = updateRenderCache(
    context,
    root,
    camera,
    () => {
      return shaderMaterial;
    },
    sceneTreeCache
  );
  console.timeEnd('updateRenderCache');

  const backgroundProgram = makeProgramFromShaderMaterial(
    context,
    backgroundMaterial
  );
  const backgroundUniforms = {
    viewToWorld: new Mat4(),
    screenToView: mat4Inverse(
      mat4PerspectiveFov(30, 0.1, 4, 1, canvasFramebuffer.aspectRatio)
    ),
    cubeMap: cubeMap
  };
  const backgroundBufferGeometry = makeBufferGeometryFromGeometry(
    context,
    backgroundGeometry
  );

  canvasFramebuffer.blendState = blendModeToBlendState(Blending.Over, true);

  canvasFramebuffer.devicePixelRatio = window.devicePixelRatio;
  //canvasFramebuffer.clearState = new ClearState(new Color3(1, 1, 1));

  function animate(): void {
    requestAnimationFrame(animate);

    // stats.time(() => {
    canvasFramebuffer.clear();

    backgroundUniforms.viewToWorld = mat4Inverse(
      quatToMat4(orbitController.rotation)
    );
    backgroundUniforms.screenToView = mat4Inverse(
      mat4PerspectiveFov(30, 0.1, 4, 1, canvasFramebuffer.aspectRatio)
    );

    orbitController.update();
    orbitNode.rotation = orbitController.rotation;
    camera.zoom = orbitController.zoom;
    camera.dirty();
    orbitNode.dirty();

    updateNodeTree(root, sceneTreeCache); // this is by far the slowest part of the system.
    updateDirtyNodes(sceneTreeCache, renderCache, canvasFramebuffer);
    renderScene(canvasFramebuffer, renderCache);
    //});

    /* renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program: backgroundProgram,
      uniforms: backgroundUniforms,
      bufferGeometry: backgroundBufferGeometry
      //  depthTestState: backgroundDepthTestState
    });*/
  }

  animate();
}

init();
