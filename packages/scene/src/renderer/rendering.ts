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

  const msaaColorRenderbuffer = new Renderbuffer(
    context,
    renderCache.numMSAASamples,
    renderCache.renderInternalFormat,
    size
  );
  const msaaDepthRenderbuffer = new Renderbuffer(
    context,
    renderCache.numMSAASamples,
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
      renderCache.renderInternalFormat,
      TextureFilter.Linear,
      TextureFilter.LinearMipmapLinear
    )
  );

  const blurSize = vec2Ceil(vec2MultiplyByScalar(size, 1));
  const tempFramebuffer = new Framebuffer(context);
  tempFramebuffer.attach(
    Attachment.Color0,
    makeColorAttachment(context, blurSize, renderCache.renderInternalFormat)
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
    blendMeshBatches,
    multisampleFramebuffer,
    tempMipmapFramebuffer: opaqueFramebuffer,
    tempFramebuffer,
    userUniforms,
    gaussianBlur,
    toneMapper,
    isBloom,
    isTransmission
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

  const opaqueTexImage2D = opaqueFramebuffer.getAttachment(
    Attachment.Color0
  ) as TexImage2D;

  if (blendMeshBatches.length > 0) {
    const blendUniforms: Record<string, any> = {
      debugOutputIndex: userUniforms.debugOutputIndex,
      outputTransformFlags: 0x4
    };

    if (isTransmission) {
      biltFramebuffers(multisampleFramebuffer, opaqueFramebuffer);
      opaqueTexImage2D.generateMipmaps();
      blendUniforms.backgroundTexture = opaqueTexImage2D;
    }

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
  }

  biltFramebuffers(multisampleFramebuffer, opaqueFramebuffer);
  opaqueTexImage2D.generateMipmaps();

  if (isBloom) {
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
  }

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
  const { cameraUniforms, lightParameters } = renderCache;

  for (const meshBatch of meshBatches) {
    const { program, uniformsArray, bufferGeometry, programVertexArray } =
      meshBatch;

    const uniforms = [...uniformsArray] as UniformValueMap[];

    uniforms.push(
      lightParameters as unknown as UniformValueMap,
      cameraUniforms as unknown as UniformValueMap
    );
    if (extraUniforms !== undefined) {
      uniforms.push(extraUniforms);
    }
    renderBufferGeometry({
      framebuffer,
      program,
      uniforms,
      bufferGeometry,
      programVertexArray,
      depthTestState,
      blendState,
      cullingState
    });
  }
}
