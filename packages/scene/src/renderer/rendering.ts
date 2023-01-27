import {
  Blending,
  blendModeToBlendState,
  BlendState,
  renderBufferGeometry,
  UniformValueMap,
  VirtualFramebuffer
} from '@threeify/core';

import { MeshBatch } from './MeshBatch';
import { RenderCache } from './RenderCache';

export function renderScene(
  framebuffer: VirtualFramebuffer,
  renderCache: RenderCache
) {
  const { opaqueMeshBatches, blendMeshBatches, maskMeshBatches } = renderCache;

  framebuffer.blendState = BlendState.None;
  renderMeshes(framebuffer, renderCache, opaqueMeshBatches);
  framebuffer.blendState = blendModeToBlendState(Blending.Over, true);
  renderMeshes(framebuffer, renderCache, blendMeshBatches);
  framebuffer.blendState = BlendState.None;
  renderMeshes(framebuffer, renderCache, maskMeshBatches);
}

export function renderMeshes(
  framebuffer: VirtualFramebuffer,
  renderCache: RenderCache,
  meshBatches: MeshBatch[]
) {
  const {
    cameraUniforms,
    lightUniforms,
    shaderNameToLightingUniformBuffers,
    shaderNameToCameraUniformBuffers
  } = renderCache;

  for (const meshBatch of meshBatches) {
    const {
      program,
      uniformsArray,
      bufferGeometry,
      programVertexArray,
      uniformBuffers,
      textureBindings
    } = meshBatch;

    const uniforms = [...uniformsArray] as UniformValueMap[];

    const lightingBuffer = shaderNameToLightingUniformBuffers.get(program.name);
    if (uniformBuffers !== undefined && lightingBuffer !== undefined) {
      uniformBuffers['Lighting'] = lightingBuffer;
    } else {
      uniforms.push(lightUniforms as unknown as UniformValueMap);
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
      programVertexArray,
      textureBindings
    });
  }
}
