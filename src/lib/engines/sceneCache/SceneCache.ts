import { MaterialUniforms } from '../../materials/Material';
import { BufferGeometry } from '../../renderers/webgl/buffers/BufferGeometry';
import { Program } from '../../renderers/webgl/programs/Program';
import { TexImage2D } from '../../renderers/webgl/textures/TexImage2D';
import { LightUniforms } from './LightUniforms';
import { NodeUniforms } from './NodeUniforms';
import { SceneUniforms } from './SceneUniforms';

export class SceneCache {
  public cameraUniforms = new SceneUniforms();
  public lightUniforms = new LightUniforms();
  public geometryIdToBufferGeometry: Map<string, BufferGeometry> = new Map();
  public shaderNameToProgram: Map<string, Program> = new Map();
  public materialIdToUniforms: Map<string, MaterialUniforms> = new Map();
  public nodeIdToUniforms: Map<string, NodeUniforms> = new Map();
  public textureIdToTexImage2D: Map<string, TexImage2D> = new Map();
}
