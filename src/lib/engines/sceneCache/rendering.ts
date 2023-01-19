import {
  renderBufferGeometry,
  VirtualFramebuffer
} from '../../renderers/webgl/framebuffers/VirtualFramebuffer';
import { UniformValueMap } from '../../renderers/webgl/programs/UniformValueMap';
import { SceneCache } from './SceneCache';

export function renderSceneViaSceneCache(
  framebuffer: VirtualFramebuffer,
  sceneCache: SceneCache
) {
  const {
    meshBatches,
    cameraUniforms,
    lightUniforms,
    shaderNameToLightingUniformBuffers,
    shaderNameToCameraUniformBuffers
  } = sceneCache;
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
      programVertexArray
    });
  }
}
