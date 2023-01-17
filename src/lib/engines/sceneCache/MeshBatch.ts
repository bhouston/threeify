import { BufferGeometry } from '../../renderers/webgl/buffers/BufferGeometry';
import { Program } from '../../renderers/webgl/programs/Program';
import { UniformValueMap } from '../../renderers/webgl/programs/UniformValueMap';

export class MeshBatch {
  constructor(
    public program: Program,
    public bufferGeometry: BufferGeometry,
    public uniformsArray: UniformValueMap[]
  ) {}
}
