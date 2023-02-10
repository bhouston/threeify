import {
  Blending,
  blendModeToBlendState,
  fetchHDR,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromEquirectangularTexture,
  Orbit,
  PhysicalMaterialOutputs,
  RenderingContext,
  ShaderMaterial,
  Texture
} from '@threeify/core';
import {
  box3Center,
  box3MaxSize,
  Color3,
  Vec2,
  Vec3,
  vec3Negate
} from '@threeify/math';
import {
  DomeLight,
  glTFToSceneNode,
  PerspectiveCamera,
  PointLight,
  renderScene,
  renderScene_Tranmission,
  SceneNode,
  SceneTreeCache,
  subTreeStats,
  updateDirtyNodes,
  updateFramebuffers,
  updateNodeTree,
  updateRenderCache
} from '@threeify/scene';

import {
  getKhronosGlTFUrl,
  GLTFFormat,
  KhronosModel
} from '../../utilities/khronosModels';
import { GPUTimerPanel, Stats } from '../../utilities/Stats';
import { getThreeJSHDRIUrl, ThreeJSHRDI } from '../../utilities/threejsHDRIs';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';
const stats = new Stats();

const maxDebugOutputs = 62;
let debugOutputIndex = 0;

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      debugOutputIndex = (debugOutputIndex + 1) % maxDebugOutputs;
      break;
    case 'ArrowDown':
      debugOutputIndex =
        (debugOutputIndex + maxDebugOutputs - 1) % maxDebugOutputs;
      break;
    case 'Escape':
      debugOutputIndex = 0;
      break;
  }
  console.log(
    `Debug Channel ${PhysicalMaterialOutputs[debugOutputIndex]} (${debugOutputIndex})`
  );
});

async function init(): Promise<void> {
  const shaderMaterial = new ShaderMaterial(
    'index',
    vertexSource,
    fragmentSource
  );
  //console.time('fetchHDR');
  const latLongTexture = new Texture(
    await fetchHDR(getThreeJSHDRIUrl(ThreeJSHRDI.royal_esplanade_1k))
  );
  /* const latLongTexture = new Texture(
     await fetchImage('/assets/textures/cube/debug/latLong.png')
   );*/
  //console.timeEnd('fetchHDR');
  const lightIntensity = 1;
  const domeLightIntensity = 2.5;
  const transmissionMode = true;

  const glTFModel = await glTFToSceneNode(
    getKhronosGlTFUrl(KhronosModel.TransmissionTest, GLTFFormat.glTF)
  );

  const canvasHtmlElement = document.getElementById(
    'framebuffer'
  ) as HTMLCanvasElement;
  const context = new RenderingContext(canvasHtmlElement, {
    antialias: false,
    depth: false
  });
  const { canvasFramebuffer } = context;
  canvasFramebuffer.devicePixelRatio = 1.5;
  canvasFramebuffer.resize();
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const program = makeProgramFromShaderMaterial(context, shaderMaterial);
  const gpuRender = new GPUTimerPanel(context);
  stats.addPanel(gpuRender);

  //console.time('makeTexImage2DFromEquirectangularTexture');
  const cubeMap = makeTexImage2DFromEquirectangularTexture(
    context,
    latLongTexture,
    new Vec2(1024, 1024)
  );
  //console.timeEnd('makeTexImage2DFromEquirectangularTexture');

  const orbitController = new Orbit(canvasHtmlElement);
  orbitController.zoom = 1.5;
  orbitController.zoomMax = 9;

  const sceneTreeCache = new SceneTreeCache();

  const root = new SceneNode({ name: 'root' });
  //console.time('glTFToSceneNode');

  //console.timeEnd('glTFToSceneNode');

  //console.time('updateNodeTree');
  updateNodeTree(glTFModel, sceneTreeCache);
  //console.timeEnd('updateNodeTree');

  const glTFBoundingBox = glTFModel.subTreeBoundingBox;
  glTFModel.translation = vec3Negate(box3Center(glTFBoundingBox));
  glTFModel.dirty();
  const maxSize = box3MaxSize(glTFBoundingBox);

  const orbitNode = new SceneNode({
    name: 'orbit',
    translation: new Vec3(
      Math.random() * 0.25 - 0.125,
      Math.random() * 0.25 - 0.125,
      -2
    ),
    scale: new Vec3(1 / maxSize, 1 / maxSize, 1 / maxSize)
  });

  orbitController.rotation.copy(orbitNode.rotation);
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
    translation: Vec3.Zero
  });
  root.children.push(camera);
  const domeLight = new DomeLight({
    name: 'DomeLight',
    cubeMap: cubeMap,
    translation: orbitNode.translation,
    color: Color3.White,
    intensity: domeLightIntensity
  });
  root.children.push(domeLight);

  updateNodeTree(root, sceneTreeCache);

  const treeStats = subTreeStats(root);

  console.log(`Subtree stats: ${JSON.stringify(treeStats, null, 2)}`);

  //console.time('updateRenderCache');
  const renderCache = updateRenderCache(
    context,
    root,
    camera,
    () => {
      return program;
    },
    sceneTreeCache
  );
  //console.timeEnd('updateRenderCache');

  canvasFramebuffer.blendState = blendModeToBlendState(Blending.Over, true);

  //canvasFramebuffer.clearState = new ClearState(Color3.White

  updateFramebuffers(canvasFramebuffer, renderCache);

  renderCache.userUniforms.outputTransformFlags = 0x1 + 0x2 + 0x4;

  function animate(): void {
    requestAnimationFrame(animate);

    stats.time(() => {
      canvasFramebuffer.clear();

      renderCache.userUniforms.debugOutputIndex = debugOutputIndex;

      orbitController.update();
      orbitNode.rotation = orbitController.rotation;
      camera.zoom = orbitController.zoom;
      camera.dirty();
      orbitNode.dirty();

      updateNodeTree(root, sceneTreeCache); // this is by far the slowest part of the system.
      updateDirtyNodes(sceneTreeCache, renderCache, canvasFramebuffer);
      gpuRender.time(() => {
        if (transmissionMode) {
          renderScene_Tranmission(canvasFramebuffer, renderCache);
        } else {
          renderScene(canvasFramebuffer, renderCache);
        }
      });
    });
  }

  animate();
}

init();
