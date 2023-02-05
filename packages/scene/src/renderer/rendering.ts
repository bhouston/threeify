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
  UniformValueMap,
  VirtualFramebuffer
} from '@threeify/core';
import { Color3 } from '@threeify/vector-math';

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

  const backgroundFramebuffer = new Framebuffer(context);
  backgroundFramebuffer.attach(
    Attachment.Color0,
    makeColorAttachment(context, size)
  );

  renderCache.opaqueFramebuffer = opaqueFramebuffer;
  renderCache.backgroundFramebuffer = backgroundFramebuffer;
  renderCache.blendFramebuffer = blendFramebuffer;
}
export function renderScene(
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

  opaqueFramebuffer.clearState = new ClearState(new Color3(0, 0, 0), 1);
  opaqueFramebuffer.clear(BufferBit.All);
  opaqueFramebuffer.depthTestState = new DepthTestState(
    true,
    DepthTestFunc.Less,
    true
  );
  opaqueFramebuffer.cullingState = new CullingState(true, CullingSide.Back);
  opaqueFramebuffer.blendState = BlendState.None;
  renderMeshes(opaqueFramebuffer, renderCache, opaqueMeshBatches);

  const opaqueTexImage2D = opaqueFramebuffer.getAttachment(Attachment.Color0);
  if (opaqueTexImage2D === undefined) throw new Error('No color attachment 1');

  backgroundFramebuffer.clearState = new ClearState(new Color3(0, 0, 0), 0);
  backgroundFramebuffer.clear(BufferBit.All);

  const backgroundTexImage2D = backgroundFramebuffer.getAttachment(
    Attachment.Color0
  );
  if (backgroundTexImage2D === undefined)
    throw new Error('No color attachment 1');

  context.blendState = blendModeToBlendState(Blending.Over, true);
  backgroundFramebuffer.depthTestState = new DepthTestState(false);
  copyPass(opaqueTexImage2D, backgroundTexImage2D);
  backgroundTexImage2D.generateMipmaps();

  blendFramebuffer.clearState = new ClearState(new Color3(0, 0, 0), 0);
  blendFramebuffer.cullingState = new CullingState(false);
  blendFramebuffer.depthTestState = new DepthTestState(
    true,
    DepthTestFunc.Less,
    true
  );
  blendFramebuffer.clear(BufferBit.All);
  blendFramebuffer.blendState = blendModeToBlendState(Blending.Over, true);
  renderMeshes(blendFramebuffer, renderCache, blendMeshBatches, {
    backgroundTexture: backgroundTexImage2D
  });

  const blendTexImage2D = blendFramebuffer.getAttachment(Attachment.Color0);
  if (blendTexImage2D === undefined) throw new Error('No color attachment 2');

  opaqueFramebuffer.blendState = blendModeToBlendState(Blending.Over, true);
  copyPass(blendTexImage2D, opaqueTexImage2D);

  canvasFramebuffer.depthTestState = new DepthTestState(false);
  canvasFramebuffer.blendState = blendModeToBlendState(Blending.Over, true);
  copyPass(opaqueTexImage2D, undefined);
}

export function renderMeshes(
  framebuffer: VirtualFramebuffer,
  renderCache: RenderCache,
  meshBatches: MeshBatch[],
  extraUniforms?: UniformValueMap
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
      programVertexArray
    });
  }
}
