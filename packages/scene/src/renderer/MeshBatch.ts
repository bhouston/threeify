import {
  BufferGeometry,
  Program,
  ProgramVertexArray,
  TextureBindings,
  UniformBufferMap,
  UniformValueMap
} from '@threeify/core';

export class MeshBatch {
  constructor(
    public program: Program,
    public bufferGeometry: BufferGeometry,
    public programVertexArray: ProgramVertexArray,
    public uniformsArray: UniformValueMap[],
    public uniformBuffers: UniformBufferMap,
    public textureBindings: TextureBindings
  ) {}
}
