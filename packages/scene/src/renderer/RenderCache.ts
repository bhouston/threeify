import {
  Buffer,
  BufferGeometry,
  CopyPass,
  Framebuffer,
  GaussianBlur,
  InternalFormat,
  Program,
  ProgramVertexArray,
  RenderingContext,
  TexImage2D,
  ToneMapper,
  UniformValueMap
} from '@threeify/core';

import { Material } from '../materials/Material.js';
import { CameraNode } from '../scene/cameras/CameraNode.js';
import { SceneNode } from '../scene/SceneNode.js';
import { CameraUniforms } from './CameraUniforms.js';
import { LightParameters } from './LightParameters.js';
import { MeshBatch } from './MeshBatch.js';
import { NodeUniforms } from './NodeUniforms.js';

export class RenderCache {
  constructor(
    public context: RenderingContext,
    public copyPass: CopyPass,
    public gaussianBlur: GaussianBlur,
    public toneMapper: ToneMapper
  ) {}

  public renderInternalFormat = InternalFormat.RGBA16F; // alternative is: RGBA8
  public numMSAASamples = 4;
  public isBloom = true;
  public isTransmission = true;

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

  // render targets
  public multisampleFramebuffer?: Framebuffer;
  public tempMipmapFramebuffer?: Framebuffer;
  public tempFramebuffer?: Framebuffer;

  public userUniforms: UniformValueMap = {};
}
