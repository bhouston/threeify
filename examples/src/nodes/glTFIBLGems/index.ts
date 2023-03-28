import {
  Blending,
  blendModeToBlendState,
  equirectangularTextureToCubeMap,
  fetchHDR,
  InternalFormat,
  Orbit,
  PhysicalMaterialOutputs,
  RenderingContext,
  ShaderMaterial,
  shaderMaterialToProgram,
  Texture,
  TextureCache,
  TextureEncoding
} from '@threeify/core';
import {
  box3Center,
  box3MaxSize,
  Color3,
  Vec3,
  vec3Negate
} from '@threeify/math';
import {
  depthFirstVisitor,
  MeshNode,
  PhysicalMaterial,
  physicalToGemMaterial,
  renderScene
} from '@threeify/scene';
import {
  createRenderCache,
  DomeLight,
  glTFToSceneNode,
  PerspectiveCamera,
  PointLight,
  SceneNode,
  SceneTreeCache,
  subTreeStats,
  updateDirtyNodes,
  updateFramebuffers,
  updateNodeTree,
  updateRenderCache
} from '@threeify/scene';

import { GPUTimerPanel, Stats } from '../../utilities/Stats';
import { getThreeJSHDRIUrl, ThreeJSHRDI } from '../../utilities/threejsHDRIs';
import fragmentSource from './fragment.glsl';
import { ShaderOutputs } from './ShaderOutputs';
import vertexSource from './vertex.glsl';

const stats = new Stats();

const maxDebugOutputs = 71;
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
    `Debug Channel ${
      PhysicalMaterialOutputs[debugOutputIndex] ||
      ShaderOutputs[debugOutputIndex]
    } (${debugOutputIndex})`
  );
});

async function init(): Promise<void> {
  console.time('init');
  const textueCache = new TextureCache();
  const glTFModelPromise = glTFToSceneNode(
    '../assets/models/gems/ring.glb',
    textueCache
  );

  const shaderMaterial = new ShaderMaterial(
    'index',
    vertexSource,
    fragmentSource
  );

  const gemShaderMaterial = new ShaderMaterial(
    'gem',
    vertexSource,
    fragmentSource
  );
  //console.time('fetchHDR');
  const hdrPromise = fetchHDR(
    getThreeJSHDRIUrl(ThreeJSHRDI.royal_esplanade_1k)
  );
  const latLongTexturePromise = hdrPromise.then((hdr) => {
    return new Texture(hdr);
  });

  //console.timeEnd('glTFToSceneNode');
  const cubeMapPromise = latLongTexturePromise.then((latLongTexture) =>
    equirectangularTextureToCubeMap(
      context,
      latLongTexture,
      TextureEncoding.RGBE,
      1024,
      InternalFormat.RGBA16F
    )
  );

  /* const latLongTexture = new Texture(
     await fetchImage('/assets/textures/cube/debug/latLong.png')
   );*/
  //console.timeEnd('fetchHDR');
  const lightIntensity = 0;
  const domeLightIntensity = 1.5;
  const transmissionMode = false;

  const canvasHtmlElement = document.getElementById(
    'framebuffer'
  ) as HTMLCanvasElement;
  const context = new RenderingContext(canvasHtmlElement, {
    antialias: false,
    depth: false,
    premultipliedAlpha: true
  });
  const { canvasFramebuffer } = context;
  canvasFramebuffer.devicePixelRatio = 1;
  canvasFramebuffer.resize();
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const programPromise = shaderMaterialToProgram(context, shaderMaterial);
  const gemProgramPromise = shaderMaterialToProgram(context, gemShaderMaterial);
  const gpuRender = new GPUTimerPanel(context);
  stats.addPanel(gpuRender);

  //console.timeEnd('makeTexImage2DFromEquirectangularTexture');

  const orbitController = new Orbit(canvasHtmlElement);
  orbitController.zoom = 1.5;
  orbitController.zoomMax = 9;

  const sceneTreeCache = new SceneTreeCache();

  const root = new SceneNode({ name: 'root' });
  //console.time('glTFToSceneNode');

  const glTFModel = await glTFModelPromise;

  //console.log(JSON.stringify(sceneNodeToJson(glTFModel), null, 2));

  depthFirstVisitor(glTFModel, (node) => {
    //    console.log('node.type', node.constructor.name);
    if (node instanceof MeshNode) {
      if (node.name.includes('dia')) {
        //      console.log('node.name', node.name);
        const physicalMaterial = node.material as PhysicalMaterial;
        const gemMaterial = physicalToGemMaterial(physicalMaterial);
        gemMaterial.gemSquishFactor = new Vec3(1, 1, 0.5);
        gemMaterial.gemBoostFactor = 1;
        gemMaterial.gemNormalCubeMapId = node.name.includes('0') ? 1 : 0;
        node.material = gemMaterial;
      }
    }
  });

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
    cubeMap: await cubeMapPromise,
    translation: orbitNode.translation,
    color: Color3.White,
    intensity: domeLightIntensity
  });
  root.children.push(domeLight);

  updateNodeTree(root, sceneTreeCache);

  const treeStats = subTreeStats(root);

  //console.log(`Subtree stats: ${JSON.stringify(treeStats, null, 2)}`);

  //console.time('updateRenderCache');
  const program = await programPromise;
  const gemProgram = await gemProgramPromise;
  const renderCache = await createRenderCache(context);
  updateRenderCache(
    context,
    root,
    camera,
    (shaderName: string) => {
      return shaderName === 'gem' ? gemProgram : program;
    },
    sceneTreeCache,
    renderCache
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
        renderScene(canvasFramebuffer, renderCache);
      });
    });
  }

  console.timeEnd('init');
  animate();
}

init();
