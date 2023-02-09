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
  TexImage2D,
  TextureFilter,
  UniformValueMap,
  VirtualFramebuffer
} from '@threeify/core';
import { Color3 } from '@threeify/math';

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

  const backgroundFramebuffer = new Framebuffer(context);
  backgroundFramebuffer.attach(
    Attachment.Color0,
    makeColorAttachment(
      context,
      size,
      undefined,
      TextureFilter.Linear,
      TextureFilter.LinearMipmapLinear
    )
  );

  renderCache.opaqueFramebuffer = opaqueFramebuffer;
  renderCache.backgroundFramebuffer = backgroundFramebuffer;
}

export function renderScene(
  canvasFramebuffer: CanvasFramebuffer,
  renderCache: RenderCache
) {
  const {
    opaqueMeshBatches,
    opaqueFramebuffer,
    blendMeshBatches,
    userUniforms
  } = renderCache;
  const { context } = canvasFramebuffer;
  if (opaqueFramebuffer === undefined)
    throw new Error('Framebuffers not initialized');

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

  const uniforms = {
    debugOutputIndex: userUniforms.debugOutputIndex,
    outputTransformFlags: userUniforms.outputTransformFlags
  };

  renderMeshes(
    canvasFramebuffer,
    renderCache,
    opaqueMeshBatches,
    uniforms,
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
    userUniforms
  } = renderCache;
  const { context } = canvasFramebuffer;
  if (opaqueFramebuffer === undefined || backgroundFramebuffer === undefined)
    throw new Error('Framebuffers not initialized');

  const overBlending = blendModeToBlendState(Blending.Over, true);
  const noBlending = BlendState.None;

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
    {
      debugOutputIndex: userUniforms.debugOutputIndex,
      outputTransformFlags: userUniforms.outputTransformFlags
    },
    normalDepthTesting,
    overBlending,
    normalCulling
  );

  const opaqueTexImage2D = opaqueFramebuffer.getAttachment(Attachment.Color0);
  if (
    opaqueTexImage2D === undefined ||
    !(opaqueTexImage2D instanceof TexImage2D)
  )
    throw new Error('No color attachment 1');

  if (blendMeshBatches.length > 0) {
    backgroundFramebuffer.clearState = new ClearState(Color3.Black, 1);
    backgroundFramebuffer.clear(BufferBit.All);

    const backgroundTexImage2D = backgroundFramebuffer.getAttachment(
      Attachment.Color0
    );
    if (
      backgroundTexImage2D === undefined ||
      !(backgroundTexImage2D instanceof TexImage2D)
    )
      throw new Error('No color attachment 1');

    copyPass({
      sourceTexImage2D: opaqueTexImage2D,
      targetFramebuffer: backgroundFramebuffer,
      blendState: noBlending,
      depthTestState: noDepthTesting
    });
    backgroundTexImage2D.generateMipmaps();

    const blendUniforms = {
      backgroundTexture: backgroundTexImage2D,
      debugOutputIndex: userUniforms.debugOutputIndex,
      outputTransformFlags: userUniforms.outputTransformFlags
    };
    renderMeshes(
      opaqueFramebuffer,
      renderCache,
      blendMeshBatches,
      blendUniforms,
      normalDepthTesting,
      overBlending,
      reverseCulling
    );
    renderMeshes(
      opaqueFramebuffer,
      renderCache,
      blendMeshBatches,
      blendUniforms,
      normalDepthTesting,
      overBlending,
      normalCulling
    );
  }

  canvasFramebuffer.clearState = new ClearState(Color3.Black, 1);
  canvasFramebuffer.clear(BufferBit.All);
  copyPass({
    sourceTexImage2D: opaqueTexImage2D,
    targetFramebuffer: canvasFramebuffer,
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
    shaderNameToCameraUniformBuffers,
    userUniforms
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
    // uniforms.push(userUniforms);

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
