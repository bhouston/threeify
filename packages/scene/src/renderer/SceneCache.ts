import {
  BufferGeometry,
  ProgramVertexArray,
  Buffer,
  Program,
  TexImage2D,
  UniformValueMap,
  Material
} from '@threeify/core';
import { SceneNode } from '../scene/SceneNode';
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
  public materialIdToMaterial: Map<string, Material> = new Map();
  public materialIdToUniforms: Map<string, UniformValueMap> = new Map();
  public materialIdToMaterialUniformBuffers: Map<string, Buffer> = new Map();
  public textureIdToTexImage2D: Map<string, TexImage2D> = new Map();

  public shaderNameToLightingUniformBuffers: Map<string, Buffer> = new Map();
  public shaderNameToCameraUniformBuffers: Map<string, Buffer> = new Map();
  public meshBatches: MeshBatch[] = [];
}
