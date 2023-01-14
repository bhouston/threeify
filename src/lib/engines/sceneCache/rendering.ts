import {
  renderBufferGeometry,
  VirtualFramebuffer
} from '../../renderers/webgl/framebuffers/VirtualFramebuffer';
import { SceneNode as SceneNode } from '../../scene/SceneNode';
import { SceneCache } from './SceneCache';

export function renderSceneViaSceneCache(
  framebuffer: VirtualFramebuffer,
  rootNode: SceneNode,
  sceneCache: SceneCache
) {
  const { meshBatches } = sceneCache;
  for (const meshBatch of meshBatches) {
    const { program, uniformsArray, bufferGeometry } = meshBatch;
    renderBufferGeometry(framebuffer, program, uniformsArray, bufferGeometry);
  }
}
