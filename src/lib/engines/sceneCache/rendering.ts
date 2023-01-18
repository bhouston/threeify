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
    shaderNameToLightUniformBuffers: shaderNameToLightingUniformBuffers
  } = sceneCache;
  for (const meshBatch of meshBatches) {
    const {
      program,
      uniformsArray,
      bufferGeometry,
      programVertexArray,
      uniformBuffers
    } = meshBatch;

    let uniforms = [
      ...uniformsArray,
      cameraUniforms,
      lightUniforms
    ] as UniformValueMap[];
    const lightingBuffer = shaderNameToLightingUniformBuffers.get(program.name);
    if (uniformBuffers !== undefined && lightingBuffer !== undefined) {
      uniformBuffers['Lighting'] = lightingBuffer;

      uniforms = [...uniformsArray, cameraUniforms] as UniformValueMap[];
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
