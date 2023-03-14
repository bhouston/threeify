import {
  AlphaMode,
  CubeMapTexture,
  geometryToBufferGeometry,
  Program,
  ProgramUniform,
  ProgramVertexArray,
  RenderingContext,
  Texture,
  textureToTexImage2D,
  UniformBufferMap,
  UniformValueMap,
  VirtualFramebuffer
} from '@threeify/core';
import {
  color3MultiplyByScalar,
  mat4Inverse,
  mat4TransformNormal3,
  mat4TransformVec3,
  Vec3
} from '@threeify/math';

import { MaterialParameters } from '../materials/MaterialParameters';
import { PhysicalMaterial } from '../materials/PhysicalMaterial';
import { CameraNode } from '../scene/cameras/CameraNode';
import { DirectionalLight } from '../scene/lights/DirectionalLight';
import { DomeLight } from '../scene/lights/DomeLight';
import { Light } from '../scene/lights/Light';
import { LightType } from '../scene/lights/LightType';
import { PointLight } from '../scene/lights/PointLight';
import { SpotLight } from '../scene/lights/SpotLight';
import { MeshNode } from '../scene/Mesh';
import { SceneNode } from '../scene/SceneNode';
import { breadthFirstVisitor } from '../scene/Visitors';
import { CameraUniforms } from './CameraUniforms';
import { LightParameters } from './LightParameters';
import { MeshBatch } from './MeshBatch';
import { NodeUniforms } from './NodeUniforms';
import { RenderCache } from './RenderCache';
import { SceneTreeCache } from './SceneTreeCache';

export function updateDirtyNodes(
  sceneTreeCache: SceneTreeCache,
  renderCache: RenderCache,
  framebuffer: VirtualFramebuffer | undefined = undefined
) {
  const { nodeIdToUniforms, breathFirstNodes, activeCamera, cameraUniforms } =
    renderCache;
  for (const node of breathFirstNodes) {
    const nodeUniforms = nodeIdToUniforms.get(node.id) || new NodeUniforms();
    nodeUniforms.localToWorld.copy(node.localToWorld);
    nodeIdToUniforms.set(node.id, nodeUniforms);
  }

  if (activeCamera !== undefined) {
    if (framebuffer !== undefined) {
      const renderTargetSize = framebuffer.size;
      activeCamera.viewAspectRatio = renderTargetSize.x / renderTargetSize.y;
    }
    updateCameraUniforms(activeCamera, cameraUniforms);
  }
}

export function updateRenderCache(
  context: RenderingContext,
  rootNode: SceneNode,
  activeCamera: CameraNode | undefined,
  shaderResolver: (shaderName: string) => Program,
  sceneTreeCache: SceneTreeCache,
  renderCache: RenderCache
) {
  const {
    nodeIdToUniforms,
    nodeIdToRenderVersion: nodeIdToVersion,
    cameraUniforms,
    lightParameters: lightUniforms,
    breathFirstNodes
  } = renderCache;

  breadthFirstVisitor(rootNode, (node: SceneNode) => {
    breathFirstNodes.push(node);

    const nodeUniforms = new NodeUniforms();
    nodeUniforms.localToWorld.copy(node.localToWorld);
    nodeIdToUniforms.set(node.id, nodeUniforms);

    nodeIdToVersion.set(node.id, node.version);

    if (
      node instanceof CameraNode &&
      (activeCamera === undefined || node === activeCamera)
    ) {
      renderCache.activeCamera = node;
      updateCameraUniforms(node as CameraNode, cameraUniforms);
    }

    if (node instanceof Light) {
      updateLightUniforms(node as Light, lightUniforms, context);
    }

    if (node instanceof MeshNode) {
      meshToSceneCache(context, node, shaderResolver, renderCache);
    }
  });

  createLightingUniformBuffers(renderCache);
  createCameraUniformBuffers(renderCache);
  createMaterialUniformBuffers(renderCache);

  createMeshBatches(renderCache);

  return renderCache;
}

function updateCameraUniforms(
  camera: CameraNode,
  cameraUniforms: CameraUniforms
) {
  cameraUniforms.viewToClip.copy(camera.getViewToClipProjection()); // TODO, use a dynamic aspect ratio
  cameraUniforms.worldToView.copy(camera.worldToView);
  mat4Inverse(cameraUniforms.worldToView, cameraUniforms.viewToWorld);
}

function flattenMaterialParameters(
  parameters: MaterialParameters
): MaterialParameters {
  const flattenedParameters: MaterialParameters = {};
  for (const key in parameters) {
    const value = parameters[key];
    if (value === null && value === undefined) {
      continue;
    }
    if (typeof value === 'object' && 'getParameters' in value) {
      const flattenedValue = flattenMaterialParameters(value.getParameters());
      for (const flattenedKey in flattenedValue) {
        flattenedParameters[key + '.' + flattenedKey] =
          flattenedValue[flattenedKey];
      }
      continue;
    }
    flattenedParameters[key] = value;
  }
  return flattenedParameters;
}

function meshToSceneCache(
  context: RenderingContext,
  mesh: MeshNode,
  shaderResolver: (shaderName: string) => Program,
  renderCache: RenderCache
) {
  const {
    geometryIdToBufferGeometry,
    shaderNameToProgram,
    materialIdToUniforms,
    textureIdToTexImage2D,
    materialIdToMaterial
  } = renderCache;

  // make buffer geometry
  const geometry = mesh.geometry;
  if (!geometryIdToBufferGeometry.has(geometry.id)) {
    const bufferGeometry = geometryToBufferGeometry(context, geometry);
    geometryIdToBufferGeometry.set(geometry.id, bufferGeometry);
  }

  const material = mesh.material;

  if (!materialIdToMaterial.has(material.id)) {
    materialIdToMaterial.set(material.id, material);
  }

  // compile shader program
  if (!shaderNameToProgram.has(material.shaderName)) {
    // get shader material
    const program = shaderResolver(material.shaderName);
    shaderNameToProgram.set(material.shaderName, program);
  }

  // make material uniforms
  if (!materialIdToUniforms.has(material.id)) {
    const materialParameters = flattenMaterialParameters(
      material.getParameters()
    );
    const materialUniforms: UniformValueMap = {};
    for (const uniformName of Object.keys(materialParameters)) {
      const uniformValue = materialParameters[uniformName];
      // convert from Parameters to Uniforms
      if (uniformValue instanceof Texture) {
        const texture = uniformValue as Texture;

        const textureId = texture.id;
        let texImage2D = textureIdToTexImage2D.get(textureId);
        if (texImage2D === undefined) {
          texImage2D = textureToTexImage2D(context, texture);
          textureIdToTexImage2D.set(textureId, texImage2D);
        }
        materialUniforms[uniformName] = texImage2D;
      } else if (
        typeof uniformValue === 'object' &&
        'getParameters' in uniformValue
      ) {
        throw new Error(
          `nested parameters are not supported here, should already be flattened, ${uniformName}}`
        );
      } else {
        materialUniforms[uniformName] = uniformValue;
      }
    }

    materialIdToUniforms.set(material.id, materialUniforms);
  }
}

function updateLightUniforms(
  light: Light,
  lightUniforms: LightParameters,
  context: RenderingContext
) {
  const lightWorldPosition = mat4TransformVec3(light.localToWorld, Vec3.Zero);
  const lightIntensity = color3MultiplyByScalar(light.color, light.intensity);

  let lightType = LightType.Directional;
  let lightWorldDirection = new Vec3();
  let lightRange = -1;
  let lightInnerCos = -1;
  let lightOuterCos = -1;

  if (light instanceof DomeLight) {
    lightUniforms.iblMapTexture =
      light.cubeMap !== undefined
        ? light.cubeMap instanceof CubeMapTexture
          ? textureToTexImage2D(context, light.cubeMap)
          : light.cubeMap
        : undefined;
    lightUniforms.iblMapIntensity = color3MultiplyByScalar(
      light.color,
      light.intensity
    );
    if (lightUniforms.iblMapTexture !== undefined) {
      lightUniforms.iblMapMaxLod = lightUniforms.iblMapTexture.mipCount;
    }
    return;
  }

  if (light instanceof SpotLight) {
    lightType = LightType.Spot;
    lightWorldDirection = mat4TransformNormal3(
      light.localToWorld,
      new Vec3(0, 0, -1)
    );

    lightRange = light.range;
    lightInnerCos = Math.cos(light.innerConeAngle);
    lightOuterCos = Math.cos(light.innerConeAngle);
  }
  if (light instanceof PointLight) {
    lightType = LightType.Point;
    lightRange = light.range;
  }
  if (light instanceof DirectionalLight) {
    lightType = LightType.Directional;
    lightWorldDirection = mat4TransformNormal3(
      light.localToWorld,
      new Vec3(0, 0, -1)
    );
  }

  lightUniforms.numPunctualLights++;
  lightUniforms.punctualLightType.push(lightType);
  lightUniforms.punctualLightIntensity.push(lightIntensity);
  lightUniforms.punctualLightWorldPosition.push(lightWorldPosition);

  lightUniforms.punctualLightWorldDirection.push(lightWorldDirection);
  lightUniforms.punctualLightRange.push(lightRange);
  lightUniforms.punctualLightInnerCos.push(lightInnerCos);
  lightUniforms.punctualLightOuterCos.push(lightOuterCos);
}

function createMeshBatches(renderCache: RenderCache) {
  const {
    breathFirstNodes,
    geometryIdToBufferGeometry,
    shaderNameToProgram,
    materialIdToUniforms,
    nodeIdToUniforms,
    programGeometryToProgramVertexArray,
    materialIdToMaterialUniformBuffers,
    opaqueMeshBatches,
    blendMeshBatches
  } = renderCache;

  for (const node of breathFirstNodes) {
    if (node instanceof MeshNode) {
      const mesh = node as MeshNode;

      // get buffer geometry
      const geometry = mesh.geometry;
      const bufferGeometry = geometryIdToBufferGeometry.get(geometry.id);
      if (bufferGeometry === undefined)
        throw new Error('Buffer Geometry not found');

      // get shader program
      const material = mesh.material as PhysicalMaterial;
      const program = shaderNameToProgram.get(material.shaderName);
      if (program === undefined) throw new Error('Program not found');

      const programBufferGeometryId = `${program.id}-${geometry.id}`;
      let programVertexArray = programGeometryToProgramVertexArray.get(
        programBufferGeometryId
      );
      if (programVertexArray === undefined) {
        programVertexArray = new ProgramVertexArray(program, bufferGeometry);
        programGeometryToProgramVertexArray.set(
          programBufferGeometryId,
          programVertexArray
        );
      }

      // get node uniforms
      const nodeUniforms = nodeIdToUniforms.get(mesh.id);
      if (nodeUniforms === undefined)
        throw new Error('Node Uniforms not found');

      const uniformValueMaps: UniformValueMap[] = [];
      const uniformBufferMap: UniformBufferMap = {};
      const nodeUniformBlock = program.uniformBlocks['Node'];
      if (nodeUniformBlock !== undefined) {
        const nodeUniformBuffer = nodeUniformBlock.allocateUniformBuffer();

        nodeUniformBlock.setUniformsIntoBuffer(
          nodeUniforms as unknown as UniformValueMap,
          nodeUniformBuffer
        );
        uniformBufferMap['Node'] = nodeUniformBuffer;
      } else {
        uniformValueMaps.push(nodeUniforms as unknown as UniformValueMap);
      }

      const materialUniformBlock = program.uniformBlocks['Material'];
      if (materialUniformBlock !== undefined) {
        const materialUniformBuffer = materialIdToMaterialUniformBuffers.get(
          material.id
        );
        if (materialUniformBuffer === undefined)
          throw new Error('Material Uniform Buffer not found');
        uniformBufferMap['Material'] = materialUniformBuffer;
      } else {
        // get material uniforms
        const materialUniforms = materialIdToUniforms.get(material.id);
        if (materialUniforms === undefined)
          throw new Error('Material Uniforms not found');

        uniformValueMaps.push(
          filterUniforms(
            materialUniforms as unknown as UniformValueMap,
            Object.values(program.uniforms)
          )
        );
      }

      // create mesh batch
      const meshBatch = new MeshBatch(
        program,
        bufferGeometry,
        programVertexArray,
        uniformValueMaps,
        uniformBufferMap
      );
      if (
        material.alphaMode === AlphaMode.Blend ||
        material.transmissionFactor > 0
      ) {
        blendMeshBatches.push(meshBatch);
      } else {
        opaqueMeshBatches.push(meshBatch);
      }
    }
  }
}

function filterUniforms(
  uniforms: UniformValueMap,
  programUniforms: ProgramUniform[]
) {
  const filteredUniforms: UniformValueMap = {};
  for (const programUniform of programUniforms) {
    const uniformValue = uniforms[programUniform.identifier];
    if (uniformValue !== undefined) {
      filteredUniforms[programUniform.identifier] = uniformValue;
    }
  }
  return filteredUniforms;
}

function createLightingUniformBuffers(renderCache: RenderCache) {
  const {
    shaderNameToProgram,
    lightParameters: lightUniforms,
    shaderNameToLightingUniformBuffers
  } = renderCache;

  for (const shaderName of shaderNameToProgram.keys()) {
    const program = shaderNameToProgram.get(shaderName);
    if (program === undefined) throw new Error('Program not found');

    const lightingUniformBlock = program.uniformBlocks['Lighting'];
    if (lightingUniformBlock !== undefined) {
      const lightingUniformBuffer =
        lightingUniformBlock.allocateUniformBuffer();
      lightingUniformBlock.setUniformsIntoBuffer(
        lightUniforms as unknown as UniformValueMap,
        lightingUniformBuffer
      );
      shaderNameToLightingUniformBuffers.set(shaderName, lightingUniformBuffer);
    }
  }
}

function createCameraUniformBuffers(renderCache: RenderCache) {
  const {
    shaderNameToProgram,
    cameraUniforms,
    shaderNameToCameraUniformBuffers
  } = renderCache;

  for (const shaderName of shaderNameToProgram.keys()) {
    const program = shaderNameToProgram.get(shaderName);
    if (program === undefined) throw new Error('Program not found');
    const cameraUniformBlock = program.uniformBlocks['Camera'];
    if (cameraUniformBlock !== undefined) {
      const cameraUniformBuffer = cameraUniformBlock.allocateUniformBuffer();
      cameraUniformBlock.setUniformsIntoBuffer(
        cameraUniforms as unknown as UniformValueMap,
        cameraUniformBuffer
      );
      shaderNameToCameraUniformBuffers.set(shaderName, cameraUniformBuffer);
    }
  }
}

function createMaterialUniformBuffers(renderCache: RenderCache) {
  const {
    shaderNameToProgram,
    materialIdToUniforms,
    materialIdToMaterial,
    materialIdToMaterialUniformBuffers
  } = renderCache;

  for (const materialId of materialIdToUniforms.keys()) {
    const materialUniforms = materialIdToUniforms.get(materialId);
    const shaderName = materialIdToMaterial.get(materialId)?.shaderName;
    if (shaderName === undefined) throw new Error('Shader Name not found');
    const program = shaderNameToProgram.get(shaderName);
    if (program === undefined) throw new Error('Program not found');

    const materialUniformBlock = program.uniformBlocks['Material'];
    if (materialUniformBlock !== undefined) {
      const materialUniformBuffer =
        materialUniformBlock.allocateUniformBuffer();
      materialUniformBlock.setUniformsIntoBuffer(
        materialUniforms as unknown as UniformValueMap,
        materialUniformBuffer
      );
      materialIdToMaterialUniformBuffers.set(materialId, materialUniformBuffer);
    }
  }
}
