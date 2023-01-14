import {
  renderBufferGeometry,
  VirtualFramebuffer
} from '../../renderers/webgl/framebuffers/VirtualFramebuffer';
import { UniformValueMap } from '../../renderers/webgl/programs/ProgramUniform';
import { SceneCache } from './SceneCache';

export function renderSceneViaSceneCache(
  framebuffer: VirtualFramebuffer,
  sceneCache: SceneCache
) {
  const { meshBatches, cameraUniforms, lightUniforms } = sceneCache;
  for (const meshBatch of meshBatches) {
    const { program, uniformsArray, bufferGeometry } = meshBatch;
    renderBufferGeometry(
      framebuffer,
      program,
      [...uniformsArray, cameraUniforms, lightUniforms] as UniformValueMap[],
      bufferGeometry
    );
  }
}
