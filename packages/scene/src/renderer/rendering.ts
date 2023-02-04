import {
  Attachment,
  Blending,
  blendModeToBlendState,
  BlendState,
  BufferBit,
  CanvasFramebuffer,
  CullingSide,
  CullingState,
  Framebuffer,
  makeColorAttachment,
  makeDepthAttachment,
  renderBufferGeometry,
  UniformValueMap,
  VirtualFramebuffer
} from '@threeify/core';

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

  renderCache.opaqueFramebuffer = opaqueFramebuffer;
  renderCache.blendFramebuffer = blendFramebuffer;
}
export function renderScene(
  canvasFramebuffer: CanvasFramebuffer,
  renderCache: RenderCache
) {
  const { opaqueMeshBatches, blendMeshBatches } = renderCache;

  const { opaqueFramebuffer, blendFramebuffer } = renderCache;
  if (opaqueFramebuffer === undefined || blendFramebuffer === undefined)
    throw new Error('Framebuffers not initialized');

  canvasFramebuffer.cullingState = new CullingState(false, CullingSide.Back);

  opaqueFramebuffer?.clear(BufferBit.All);
  opaqueFramebuffer.cullingState = new CullingState(true, CullingSide.Back);
  opaqueFramebuffer.blendState = BlendState.None;
  renderMeshes(canvasFramebuffer, renderCache, opaqueMeshBatches);

  const opaqueTexImage2D = opaqueFramebuffer.getAttachment(Attachment.Color0);
  if (opaqueTexImage2D === undefined) throw new Error('No color attachment 1');
  opaqueTexImage2D.generateMipmaps();

  blendFramebuffer.clear(BufferBit.All);
  blendFramebuffer.blendState = blendModeToBlendState(Blending.Over, true);
  renderMeshes(canvasFramebuffer, renderCache, blendMeshBatches);

  const blendTexImage2D = blendFramebuffer.getAttachment(Attachment.Color0);
  if (blendTexImage2D === undefined) throw new Error('No color attachment 2');

  //  copyPass(blendTexImage2D, opaqueTexImage2D);
  //copyPass(opaqueTexImage2D, undefined);
}

export function renderMeshes(
  framebuffer: VirtualFramebuffer,
  renderCache: RenderCache,
  meshBatches: MeshBatch[]
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
