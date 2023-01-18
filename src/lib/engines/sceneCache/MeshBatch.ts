import { BufferGeometry } from '../../renderers/webgl/buffers/BufferGeometry';
import { Program } from '../../renderers/webgl/programs/Program';
import { UniformBufferMap } from '../../renderers/webgl/programs/ProgramUniformBlock';
import { ProgramVertexArray } from '../../renderers/webgl/programs/ProgramVertexArray';
import { UniformValueMap } from '../../renderers/webgl/programs/UniformValueMap';

export class MeshBatch {
  constructor(
    public program: Program,
    public bufferGeometry: BufferGeometry,
    public programVertexArray: ProgramVertexArray,
    public uniformsArray: UniformValueMap[],
    public uniformBuffers: UniformBufferMap
  ) {}
}
