import {
  Attachment,
  biltFramebuffers,
  BlendState,
  BufferBit,
  CanvasFramebuffer,
  ClearState,
  copyPass,
  CullingState,
  DepthTestState,
  Framebuffer,
  InternalFormat,
  makeColorAttachment,
  Renderbuffer,
  renderBufferGeometry,
  TexImage2D,
  TextureFilter,
  UniformValueMap,
  VirtualFramebuffer
} from '@threeify/core';
import { Color3 } from '@threeify/math';

import { combinePass } from './combinePass/combinePass';
import { MeshBatch } from './MeshBatch';
import { RenderCache } from './RenderCache';

export function updateFramebuffers(
  canvasFramebuffer: CanvasFramebuffer,
  renderCache: RenderCache
) {
  const { context, size } = canvasFramebuffer;

  const colorInternalFormat = InternalFormat.RGBA8;
  const msaaColorRenderbuffer = new Renderbuffer(
    context,
    4,
    colorInternalFormat,
    size
  );
  const msaaDepthRenderbuffer = new Renderbuffer(
    context,
    4,
    InternalFormat.DepthComponent24,
    size
  );
  const multisampleFramebuffer = new Framebuffer(context);

  multisampleFramebuffer.attach(Attachment.Color0, msaaColorRenderbuffer);
  multisampleFramebuffer.attach(Attachment.Depth, msaaDepthRenderbuffer);

  const opaqueFramebuffer = new Framebuffer(context);
  opaqueFramebuffer.attach(
    Attachment.Color0,
    makeColorAttachment(
      context,
      size,
      colorInternalFormat,
      TextureFilter.Linear,
      TextureFilter.LinearMipmapLinear
    )
  );

  const transmissionFramebuffer = new Framebuffer(context);
  transmissionFramebuffer.attach(
    Attachment.Color0,
    makeColorAttachment(context, size, colorInternalFormat)
  );

  renderCache.multisampleFramebuffer = multisampleFramebuffer;
  renderCache.opaqueFramebuffer = opaqueFramebuffer;
  renderCache.transmissionFramebuffer = transmissionFramebuffer;
}

export function renderScene(
  canvasFramebuffer: CanvasFramebuffer,
  renderCache: RenderCache
) {
  const {
    opaqueMeshBatches,
    opaqueFramebuffer,
    multisampleFramebuffer,
    transmissionFramebuffer,
    blendMeshBatches,
    userUniforms
  } = renderCache;
  const { context } = canvasFramebuffer;
  if (
    multisampleFramebuffer === undefined ||
    opaqueFramebuffer === undefined ||
    transmissionFramebuffer === undefined
  )
    throw new Error('Framebuffers not initialized');

  multisampleFramebuffer.clearState = new ClearState(Color3.Black, 1);
  multisampleFramebuffer.clear(BufferBit.All);

  const uniforms = {
    debugOutputIndex: userUniforms.debugOutputIndex,
    outputTransformFlags: 0x1 + 0x2 + 0x4
  };

  renderMeshes(
    multisampleFramebuffer,
    renderCache,
    opaqueMeshBatches,
    uniforms,
    DepthTestState.Normal,
    BlendState.PremultipliedOver,
    CullingState.Back
  );

  biltFramebuffers(multisampleFramebuffer, opaqueFramebuffer);
  const opaqueTexImage2D = opaqueFramebuffer.getAttachment(Attachment.Color0);
  if (
    opaqueTexImage2D === undefined ||
    !(opaqueTexImage2D instanceof TexImage2D)
  )
    throw new Error('No color attachment 1');

  opaqueTexImage2D.generateMipmaps();

  canvasFramebuffer.clearState = new ClearState(Color3.Black, 1);
  canvasFramebuffer.clear(BufferBit.All);
  copyPass({
    sourceTexImage2D: opaqueTexImage2D,
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
    opaqueFramebuffer,
    transmissionFramebuffer,
    userUniforms
  } = renderCache;
  if (
    multisampleFramebuffer === undefined ||
    opaqueFramebuffer === undefined ||
    transmissionFramebuffer === undefined
  )
    throw new Error('Framebuffers not initialized');

  multisampleFramebuffer.clearState = new ClearState(Color3.Black, 0);
  multisampleFramebuffer.clear(BufferBit.All);

  renderMeshes(
    multisampleFramebuffer,
    renderCache,
    opaqueMeshBatches,
    {
      debugOutputIndex: userUniforms.debugOutputIndex,
      outputTransformFlags: 0x4
    },
    DepthTestState.Normal,
    BlendState.PremultipliedOver,
    CullingState.Back
  );

  biltFramebuffers(multisampleFramebuffer, opaqueFramebuffer);
  const opaqueTexImage2D = opaqueFramebuffer.getAttachment(Attachment.Color0);
  if (
    opaqueTexImage2D === undefined ||
    !(opaqueTexImage2D instanceof TexImage2D)
  )
    throw new Error('No color attachment 1');

  opaqueTexImage2D.generateMipmaps();

  if (blendMeshBatches.length > 0) {
    const blendUniforms = {
      backgroundTexture: opaqueTexImage2D,
      debugOutputIndex: userUniforms.debugOutputIndex,
      outputTransformFlags: 0x4
    };

    multisampleFramebuffer.clearState = new ClearState(Color3.Black, 0);
    multisampleFramebuffer.clear(BufferBit.Color); // only clear color, leave depth untouched
    renderMeshes(
      multisampleFramebuffer,
      renderCache,
      blendMeshBatches,
      blendUniforms,
      DepthTestState.Normal,
      BlendState.PremultipliedOver,
      CullingState.Back
    );
    renderMeshes(
      multisampleFramebuffer,
      renderCache,
      blendMeshBatches,
      blendUniforms,
      DepthTestState.Normal,
      BlendState.PremultipliedOver,
      CullingState.Front
    );

    biltFramebuffers(multisampleFramebuffer, transmissionFramebuffer);
  }
  const transmissionTexImage2D = transmissionFramebuffer.getAttachment(
    Attachment.Color0
  );
  if (
    transmissionTexImage2D === undefined ||
    !(transmissionTexImage2D instanceof TexImage2D)
  )
    throw new Error('No color attachment 1');

  canvasFramebuffer.clearState = new ClearState(Color3.Black, 0);
  canvasFramebuffer.clear(BufferBit.All);
  combinePass({
    opaqueTexImage2D,
    transmissionTexImage2D,
    targetFramebuffer: canvasFramebuffer,
    exposure: 1
  });
  /*
  copyPass({
    sourceTexImage2D: opaqueTexImage2D,
    targetFramebuffer: canvasFramebuffer
  });*/
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
