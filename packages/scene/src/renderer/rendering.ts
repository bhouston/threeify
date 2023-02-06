import {
  Attachment,
  Blending,
  blendModeToBlendState,
  BlendState,
  BufferBit,
  CanvasFramebuffer,
  ClearState,
  copyPass,
  CullingSide,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  Framebuffer,
  makeColorAttachment,
  makeDepthAttachment,
  renderBufferGeometry,
  TextureFilter,
  UniformValueMap,
  VirtualFramebuffer
} from '@threeify/core';
import { ceilPow2, Color3, Vec2 } from '@threeify/vector-math';

import { MeshBatch } from './MeshBatch';
import { RenderCache } from './RenderCache';

export function updateFramebuffers(
  canvasFramebuffer: CanvasFramebuffer,
  renderCache: RenderCache
) {
  const { context, size } = canvasFramebuffer;

  const sharedDepthAttachment = makeDepthAttachment(context, size);
  const opaqueFramebuffer = new Framebuffer(context);
  opaqueFramebuffer.attach(
    Attachment.Color0,
    makeColorAttachment(context, size)
  );
  opaqueFramebuffer.attach(Attachment.Depth, sharedDepthAttachment);

  const blendFramebuffer = new Framebuffer(context);
  blendFramebuffer.attach(
    Attachment.Color0,
    makeColorAttachment(context, size)
  );
  blendFramebuffer.attach(Attachment.Depth, sharedDepthAttachment);

  const pow2Size = new Vec2(ceilPow2(size.x), ceilPow2(size.y));
  console.log('pow2Size', pow2Size);
  const backgroundFramebuffer = new Framebuffer(context);
  backgroundFramebuffer.attach(
    Attachment.Color0,
    makeColorAttachment(
      context,
      pow2Size,
      undefined,
      TextureFilter.Linear,
      TextureFilter.LinearMipmapLinear
    )
  );

  renderCache.opaqueFramebuffer = opaqueFramebuffer;
  renderCache.backgroundFramebuffer = backgroundFramebuffer;
  renderCache.blendFramebuffer = blendFramebuffer;
}

export function renderScene(
  canvasFramebuffer: CanvasFramebuffer,
  renderCache: RenderCache
) {
  const { opaqueMeshBatches, blendMeshBatches } = renderCache;
  const { context } = canvasFramebuffer;

  //canvasFramebuffer.cullingState = new CullingState(false, CullingSide.Back);

  const overBlending = blendModeToBlendState(Blending.Over, true);
  const noBlending = BlendState.None;

  const noCulling = new CullingState(false);
  const normalCulling = new CullingState(true, CullingSide.Back);
  const reverseCulling = new CullingState(true, CullingSide.Front);

  const noDepthTesting = new DepthTestState(false);
  const normalDepthTesting = new DepthTestState(true, DepthTestFunc.Less, true);

  canvasFramebuffer.clearState = new ClearState(Color3.Black, 1);
  canvasFramebuffer.clear(BufferBit.All);

  renderMeshes(
    canvasFramebuffer,
    renderCache,
    opaqueMeshBatches,
    undefined,
    normalDepthTesting,
    noBlending,
    normalCulling
  );

  renderMeshes(
    canvasFramebuffer,
    renderCache,
    blendMeshBatches,
    {},
    normalDepthTesting,
    overBlending,
    normalCulling
  );
}

export function renderScene_Tranmission(
  canvasFramebuffer: CanvasFramebuffer,
  renderCache: RenderCache
) {
  const {
    opaqueMeshBatches,
    blendMeshBatches,
    opaqueFramebuffer,
    backgroundFramebuffer,
    blendFramebuffer
  } = renderCache;
  const { context } = canvasFramebuffer;
  if (
    opaqueFramebuffer === undefined ||
    backgroundFramebuffer === undefined ||
    blendFramebuffer === undefined
  )
    throw new Error('Framebuffers not initialized');

  //canvasFramebuffer.cullingState = new CullingState(false, CullingSide.Back);

  const overBlending = blendModeToBlendState(Blending.Over, true);
  const noBlending = BlendState.None;

  const noCulling = new CullingState(false);
  const normalCulling = new CullingState(true, CullingSide.Back);
  const reverseCulling = new CullingState(true, CullingSide.Front);

  const noDepthTesting = new DepthTestState(false);
  const normalDepthTesting = new DepthTestState(true, DepthTestFunc.Less, true);

  opaqueFramebuffer.clearState = new ClearState(Color3.Black, 1);
  opaqueFramebuffer.clear(BufferBit.All);

  renderMeshes(
    opaqueFramebuffer,
    renderCache,
    opaqueMeshBatches,
    undefined,
    normalDepthTesting,
    noBlending,
    normalCulling
  );

  const opaqueTexImage2D = opaqueFramebuffer.getAttachment(Attachment.Color0);
  if (opaqueTexImage2D === undefined) throw new Error('No color attachment 1');

  backgroundFramebuffer.clearState = new ClearState(Color3.Black, 0);
  backgroundFramebuffer.clear(BufferBit.All);

  const backgroundTexImage2D = backgroundFramebuffer.getAttachment(
    Attachment.Color0
  );
  if (backgroundTexImage2D === undefined)
    throw new Error('No color attachment 1');

  copyPass({
    source: opaqueTexImage2D,
    target: backgroundTexImage2D,
    blendState: noBlending,
    depthTestState: noDepthTesting
  });
  backgroundTexImage2D.generateMipmaps();

  blendFramebuffer.clearState = new ClearState(Color3.Black, 0);
  blendFramebuffer.clear(BufferBit.All);
  renderMeshes(
    blendFramebuffer,
    renderCache,
    blendMeshBatches,
    {
      backgroundTexture: backgroundTexImage2D
    },
    normalDepthTesting,
    overBlending,
    reverseCulling
  );
  renderMeshes(
    blendFramebuffer,
    renderCache,
    blendMeshBatches,
    {
      backgroundTexture: backgroundTexImage2D
    },
    normalDepthTesting,
    overBlending,
    normalCulling
  );

  const blendTexImage2D = blendFramebuffer.getAttachment(Attachment.Color0);
  if (blendTexImage2D === undefined) throw new Error('No color attachment 2');

  copyPass({
    source: blendTexImage2D,
    target: opaqueTexImage2D,
    depthTestState: noDepthTesting,
    blendState: overBlending
  });

  copyPass({
    source: opaqueTexImage2D,
    target: undefined,
    depthTestState: noDepthTesting,
    blendState: overBlending
  });
}

export function renderMeshes(
  framebuffer: VirtualFramebuffer,
  renderCache: RenderCache,
  meshBatches: MeshBatch[],
  extraUniforms?: UniformValueMap,
  depthTestState?: DepthTestState,
  blendState?: BlendState,
  cullingState?: CullingState
) {
  const {
    cameraUniforms,
    lightParameters,
    shaderNameToLightingUniformBuffers,
    shaderNameToCameraUniformBuffers
  } = renderCache;

  for (const meshBatch of meshBatches) {
    const {
      program,
      uniformsArray,
      bufferGeometry,
      programVertexArray,
      uniformBuffers
    } = meshBatch;

    const uniforms = [...uniformsArray] as UniformValueMap[];

    const lightingBuffer = shaderNameToLightingUniformBuffers.get(program.name);
    if (uniformBuffers !== undefined && lightingBuffer !== undefined) {
      uniformBuffers['Lighting'] = lightingBuffer;
    } else {
      uniforms.push(lightParameters as unknown as UniformValueMap);
    }
    const cameraBuffer = shaderNameToCameraUniformBuffers.get(program.name);
    if (uniformBuffers !== undefined && cameraBuffer !== undefined) {
      uniformBuffers['Camera'] = cameraBuffer;
    } else {
      uniforms.push(cameraUniforms as unknown as UniformValueMap);
    }
    if (extraUniforms !== undefined) {
      uniforms.push(extraUniforms);
    }

    renderBufferGeometry({
      framebuffer,
      program,
      uniforms,
      uniformBuffers,
      bufferGeometry,
      programVertexArray,
      depthTestState,
      blendState,
      cullingState
    });
  }
}
