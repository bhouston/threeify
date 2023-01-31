import {
  Buffer,
  BufferGeometry,
  Material,
  Program,
  ProgramVertexArray,
  TexImage2D,
  UniformValueMap
} from '@threeify/core';

import { CameraNode } from '../scene/cameras/CameraNode';
import { SceneNode } from '../scene/SceneNode';
import { CameraUniforms } from './CameraUniforms';
import { LightParameters } from './LightParameters';
import { MeshBatch } from './MeshBatch';
import { NodeUniforms } from './NodeUniforms';

export class RenderCache {
  public breathFirstNodes: SceneNode[] = [];

  // cameraCache
  public activeCamera?: CameraNode;
  public cameraUniforms = new CameraUniforms();
  public shaderNameToCameraUniformBuffers: Map<string, Buffer> = new Map();

  // lightCache
  public lightParameters = new LightParameters();

  public shaderNameToLightingUniformBuffers: Map<string, Buffer> = new Map();
  public shaderNameToLightingUniforms: Map<string, UniformValueMap> = new Map();

  // nodeCache
  public nodeIdToRenderVersion: Map<string, number> = new Map();
  public nodeIdToUniforms: Map<string, NodeUniforms> = new Map();

  // geometryCache
  public geometryIdToBufferGeometry: Map<string, BufferGeometry> = new Map();
  public programGeometryToProgramVertexArray: Map<string, ProgramVertexArray> =
    new Map();

  // shaderCache
  public shaderNameToProgram: Map<string, Program> = new Map();

  // materialCache
  public materialIdToMaterial: Map<string, Material> = new Map();
  public materialIdToUniforms: Map<string, UniformValueMap> = new Map();
  public materialIdToMaterialUniformBuffers: Map<string, Buffer> = new Map();
  public textureIdToTexImage2D: Map<string, TexImage2D> = new Map();

  // mesh batches - separate.
  public opaqueMeshBatches: MeshBatch[] = [];
  public blendMeshBatches: MeshBatch[] = [];
  public maskMeshBatches: MeshBatch[] = [];
}
