import { BufferGeometry } from '../../renderers/webgl/buffers/BufferGeometry';
import { Program } from '../../renderers/webgl/programs/Program';
import { ProgramVertexArray } from '../../renderers/webgl/programs/ProgramVertexArray';
import { UniformValueMap } from '../../renderers/webgl/programs/UniformValueMap';
import { TexImage2D } from '../../renderers/webgl/textures/TexImage2D';
import { SceneNode } from '../../scene/SceneNode';
import { CameraUniforms } from './CameraUniforms';
import { LightUniforms } from './LightUniforms';
import { MeshBatch } from './MeshBatch';
import { NodeUniforms } from './NodeUniforms';

export class SceneCache {
  public breathFirstNodes: SceneNode[] = [];

  public cameraUniforms = new CameraUniforms();
  public lightUniforms = new LightUniforms();

  public nodeIdToUniforms: Map<string, NodeUniforms> = new Map();
  public geometryIdToBufferGeometry: Map<string, BufferGeometry> = new Map();

  public programGeometryToProgramVertexArray: Map<string, ProgramVertexArray> =
    new Map();

  public shaderNameToProgram: Map<string, Program> = new Map();
  public materialIdToUniforms: Map<string, UniformValueMap> = new Map();
  public textureIdToTexImage2D: Map<string, TexImage2D> = new Map();

  public meshBatches: MeshBatch[] = [];
}
