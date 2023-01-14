import {
  renderBufferGeometry,
  VirtualFramebuffer
} from '../../renderers/webgl/framebuffers/VirtualFramebuffer';
import { Mesh } from '../../scene/Mesh';
import { SceneNode as SceneNode } from '../../scene/SceneNode';
import { breadthFirstVisitor } from '../../scene/Visitors';
import { SceneCache } from './SceneCache';

export function renderSceneViaSceneCache(
  framebuffer: VirtualFramebuffer,
  rootNode: SceneNode,
  sceneCache: SceneCache
) {
  breadthFirstVisitor(rootNode, (node: SceneNode) => {
    if (node instanceof Mesh) {
      renderMeshViaSceneCache(framebuffer, node as Mesh, sceneCache);
    }
  });
}

export function renderMeshViaSceneCache(
  framebuffer: VirtualFramebuffer,
  mesh: Mesh,
  sceneCache: SceneCache
) {
  const {
    cameraUniforms,
    geometryIdToBufferGeometry,
    shaderNameToProgram,
    materialIdToUniforms,
    nodeIdToUniforms,
    lightUniforms
  } = sceneCache;

  // get buffer geometry
  const bufferGeometry = geometryIdToBufferGeometry.get(mesh.id);
  if (bufferGeometry === undefined)
    throw new Error('Buffer Geometry not found');

  // get shader program
  const shaderMaterial = mesh.material;
  const program = shaderNameToProgram.get(shaderMaterial.shaderName);
  if (program === undefined) throw new Error('Program not found');
  console.log('program', program.uniforms);
  // get material uniforms
  const materialUniforms = materialIdToUniforms.get(shaderMaterial.id);
  if (materialUniforms === undefined)
    throw new Error('Material Uniforms not found');

  // get node uniforms
  const nodeUniforms = nodeIdToUniforms.get(mesh.id);
  if (nodeUniforms === undefined) throw new Error('Node Uniforms not found');

  // combine uniforms
  const uniforms = {
    ...materialUniforms,
    ...nodeUniforms,
    ...cameraUniforms,
    ...lightUniforms
  };

  console.log('uniforms', uniforms);

  renderBufferGeometry(framebuffer, program, uniforms, bufferGeometry);
}
