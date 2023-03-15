import {
  Attachment,
  biltFramebuffers,
  BlendState,
  BufferBit,
  CanvasFramebuffer,
  ClearState,
  createCopyPass,
  createGaussianBlur,
  createToneMapper,
  CullingState,
  DepthTestState,
  Framebuffer,
  InternalFormat,
  makeColorAttachment,
  Renderbuffer,
  renderBufferGeometry,
  RenderingContext,
  TexImage2D,
  TextureFilter,
  UniformValueMap,
  VirtualFramebuffer
} from '@threeify/core';
import { Color3, vec2Ceil, vec2MultiplyByScalar } from '@threeify/math';

import { MeshBatch } from './MeshBatch';
import { RenderCache } from './RenderCache';

export async function createRenderCache(context: RenderingContext) {
  const [copyPass, gaussianBlur, toneMapper] = await Promise.all([
    createCopyPass(context),
    createGaussianBlur(context),
    createToneMapper(context)
  ]);
  return new RenderCache(context, copyPass, gaussianBlur, toneMapper);
}

export function updateFramebuffers(
  canvasFramebuffer: CanvasFramebuffer,
  renderCache: RenderCache
) {
  const { context, size } = canvasFramebuffer;

  const numSamples = 4;

  const colorInternalFormat = InternalFormat.RGBA16F;
  const msaaColorRenderbuffer = new Renderbuffer(
    context,
    numSamples,
    colorInternalFormat,
    size
  );
  const msaaDepthRenderbuffer = new Renderbuffer(
    context,
    numSamples,
    InternalFormat.DepthComponent24,
    size
  );
  const multisampleFramebuffer = new Framebuffer(context);

  multisampleFramebuffer.attach(Attachment.Color0, msaaColorRenderbuffer);
  multisampleFramebuffer.attach(Attachment.Depth, msaaDepthRenderbuffer);

  const tempMipmapFramebuffer = new Framebuffer(context);
  tempMipmapFramebuffer.attach(
    Attachment.Color0,
    makeColorAttachment(
      context,
      size,
      colorInternalFormat,
      TextureFilter.Linear,
      TextureFilter.LinearMipmapLinear
    )
  );

  const blurSize = vec2Ceil(vec2MultiplyByScalar(size, 1));
  const tempFramebuffer = new Framebuffer(context);
  tempFramebuffer.attach(
    Attachment.Color0,
    makeColorAttachment(context, blurSize, colorInternalFormat)
  );

  renderCache.multisampleFramebuffer = multisampleFramebuffer;
  renderCache.tempMipmapFramebuffer = tempMipmapFramebuffer;
  renderCache.tempFramebuffer = tempFramebuffer;
}

export function renderScene(
  canvasFramebuffer: CanvasFramebuffer,
  renderCache: RenderCache
) {
  const {
    opaqueMeshBatches,
    tempMipmapFramebuffer,
    multisampleFramebuffer,
    copyPass,
    toneMapper,
    userUniforms,
    blendMeshBatches
  } = renderCache;
  if (
    multisampleFramebuffer === undefined ||
    tempMipmapFramebuffer === undefined ||
    copyPass === undefined ||
    toneMapper === undefined
  )
    throw new Error('Framebuffers not initialized');

  multisampleFramebuffer.clearState = new ClearState(Color3.Black, 1);
  multisampleFramebuffer.clear(BufferBit.All);

  const uniforms = {
    debugOutputIndex: userUniforms.debugOutputIndex,
    outputTransformFlags: /*0x1 + 0x2 +*/ 0x4
  };

  renderMeshes(
    multisampleFramebuffer,
    renderCache,
    opaqueMeshBatches,
    uniforms,
    DepthTestState.Less,
    BlendState.PremultipliedOver,
    CullingState.Back
  );

  renderMeshes(
    multisampleFramebuffer,
    renderCache,
    blendMeshBatches,
    uniforms,
    DepthTestState.Less,
    BlendState.PremultipliedOver,
    CullingState.Back
  );

  // Alternative approach: could do inline tone-mapping and blit to canvasFramebuffer

  biltFramebuffers(multisampleFramebuffer, tempMipmapFramebuffer);
  const opaqueTexImage2D = tempMipmapFramebuffer.getAttachment(
    Attachment.Color0
  ) as TexImage2D;
  opaqueTexImage2D.generateMipmaps();

  canvasFramebuffer.clearState = new ClearState(Color3.Black, 1);
  canvasFramebuffer.clear(BufferBit.All);

  toneMapper.exec({
    sourceTexImage2D: opaqueTexImage2D,
    exposure: 1,
    targetFramebuffer: canvasFramebuffer
  });
}

export function renderScene_Tranmission(
  canvasFramebuffer: CanvasFramebuffer,
  renderCache: RenderCache
) {
  const {
    opaqueMeshBatches,
    blendMeshBatches,
    multisampleFramebuffer,
    tempMipmapFramebuffer: opaqueFramebuffer,
    tempFramebuffer,
    userUniforms,
    gaussianBlur,
    toneMapper
  } = renderCache;
  if (
    multisampleFramebuffer === undefined ||
    opaqueFramebuffer === undefined ||
    tempFramebuffer === undefined ||
    gaussianBlur === undefined ||
    toneMapper === undefined
  )
    throw new Error('Framebuffers or effects not initialized');

  const normalFramebuffer = opaqueFramebuffer;

  // render depth pre-pass
  multisampleFramebuffer.clearState = new ClearState(Color3.Black, 0);
  multisampleFramebuffer.clear(BufferBit.All);

  renderMeshes(
    multisampleFramebuffer,
    renderCache,
    opaqueMeshBatches,
    {
      outputTransformFlags: 0x8
    },
    DepthTestState.Less,
    BlendState.None,
    CullingState.Back
  );

  // capture normal buffer
  biltFramebuffers(multisampleFramebuffer, normalFramebuffer);

  multisampleFramebuffer.clearState = new ClearState(Color3.Black, 0);
  multisampleFramebuffer.clear(BufferBit.Color);

  renderMeshes(
    multisampleFramebuffer,
    renderCache,
    opaqueMeshBatches,
    {
      debugOutputIndex: userUniforms.debugOutputIndex,
      outputTransformFlags: 0x4
    },
    DepthTestState.LessOrEqual,
    BlendState.PremultipliedOver,
    CullingState.Back
  );

  biltFramebuffers(multisampleFramebuffer, opaqueFramebuffer);
  const opaqueTexImage2D = opaqueFramebuffer.getAttachment(
    Attachment.Color0
  ) as TexImage2D;
  opaqueTexImage2D.generateMipmaps();

  if (blendMeshBatches.length > 0) {
    const blendUniforms = {
      backgroundTexture: opaqueTexImage2D,
      debugOutputIndex: userUniforms.debugOutputIndex,
      outputTransformFlags: 0x4
    };

    renderMeshes(
      multisampleFramebuffer,
      renderCache,
      blendMeshBatches,
      blendUniforms,
      DepthTestState.Less,
      BlendState.PremultipliedOver,
      CullingState.Front
    );

    renderMeshes(
      multisampleFramebuffer,
      renderCache,
      blendMeshBatches,
      blendUniforms,
      DepthTestState.Less,
      BlendState.PremultipliedOver,
      CullingState.Back
    );

    biltFramebuffers(multisampleFramebuffer, opaqueFramebuffer);
  }

  const tempTexImage2D = tempFramebuffer.getAttachment(
    Attachment.Color0
  ) as TexImage2D;

  gaussianBlur.exec({
    sourceTexImage2D: opaqueTexImage2D,
    sourceLod: 0,
    standardDeviationInTexels: 20,
    tempTexImage2D: tempTexImage2D,
    targetFramebuffer: multisampleFramebuffer,
    targetAlpha: 0.05
  });

  biltFramebuffers(multisampleFramebuffer, opaqueFramebuffer);

  canvasFramebuffer.clearState = new ClearState(Color3.Black, 0);
  canvasFramebuffer.clear(BufferBit.All);

  toneMapper.exec({
    sourceTexImage2D: opaqueTexImage2D,
    exposure: 1,
    targetFramebuffer: canvasFramebuffer
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
