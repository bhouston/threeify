import {
  AlphaMode,
  color3MultiplyByScalar,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  mat4TransformNormal3,
  mat4TransformVec3,
  MaterialParameters,
  ProgramUniform,
  ProgramVertexArray,
  RenderingContext,
  ShaderMaterial,
  Texture,
  TextureBindings,
  UniformBufferMap,
  UniformValueMap,
  Vec3,
  VirtualFramebuffer
} from '@threeify/core';

import { CameraNode } from '../scene/cameras/CameraNode';
import { DirectionalLight } from '../scene/lights/DirectionalLight';
import { Light } from '../scene/lights/Light';
import { LightType } from '../scene/lights/LightType';
import { PointLight } from '../scene/lights/PointLight';
import { SpotLight } from '../scene/lights/SpotLight';
import { MeshNode } from '../scene/Mesh';
import { SceneNode } from '../scene/SceneNode';
import { breadthFirstVisitor } from '../scene/Visitors';
import { CameraUniforms } from './CameraUniforms';
import { LightUniforms } from './LightUniforms';
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
    nodeUniforms.localToWorld.copy(node.localToWorldMatrix);
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
  shaderResolver: (shaderName: string) => ShaderMaterial,
  sceneTreeCache: SceneTreeCache,
  renderCache: RenderCache = new RenderCache()
) {
  const {
    nodeIdToUniforms,
    nodeIdToRenderVersion: nodeIdToVersion,
    cameraUniforms,
    lightUniforms,
    breathFirstNodes
  } = renderCache;

  breadthFirstVisitor(rootNode, (node: SceneNode) => {
    breathFirstNodes.push(node);

    const nodeUniforms = new NodeUniforms();
    nodeUniforms.localToWorld.copy(node.localToWorldMatrix);
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
      updateLightUniforms(node as Light, lightUniforms);
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
  cameraUniforms.viewToScreen.copy(camera.getProjection()); // TODO, use a dynamic aspect ratio
  cameraUniforms.worldToView.copy(camera.worldToLocalMatrix);
  cameraUniforms.cameraNear = camera.near;
  cameraUniforms.cameraFar = camera.far;
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
  shaderResolver: (shaderName: string) => ShaderMaterial,
  renderCache: RenderCache
) {
  const {
    geometryIdToBufferGeometry,
    shaderNameToProgram,
    materialIdToUniforms,
    materialIdToTextureBindings,
    textureIdToTexImage2D,
    materialIdToMaterial
  } = renderCache;

  // make buffer geometry
  const geometry = mesh.geometry;
  if (!geometryIdToBufferGeometry.has(geometry.id)) {
    const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
    geometryIdToBufferGeometry.set(geometry.id, bufferGeometry);
  }

  const material = mesh.material;

  if (!materialIdToMaterial.has(material.id)) {
    materialIdToMaterial.set(material.id, material);
  }

  // compile shader program
  if (!shaderNameToProgram.has(material.shaderName)) {
    // get shader material
    const shaderMaterial = shaderResolver(material.shaderName);
    shaderMaterial.name = material.shaderName;
    const program = makeProgramFromShaderMaterial(context, shaderMaterial);
    shaderNameToProgram.set(material.shaderName, program);
  }

  // make material uniforms
  if (!materialIdToUniforms.has(material.id)) {
    const materialParameters = flattenMaterialParameters(
      material.getParameters()
    );
    const materialUniforms: UniformValueMap = {};
    const materialTextureBindings = new TextureBindings();
    for (const uniformName of Object.keys(materialParameters)) {
      const uniformValue = materialParameters[uniformName];
      // convert from Parameters to Uniforms
      if (uniformValue instanceof Texture) {
        const texture = uniformValue as Texture;
        const textureId = texture.id;
        let texImage2D = textureIdToTexImage2D.get(textureId);
        if (texImage2D === undefined) {
          texImage2D = makeTexImage2DFromTexture(context, texture);
          textureIdToTexImage2D.set(textureId, texImage2D);
        }
        materialUniforms[uniformName] =
          materialTextureBindings.bind(texImage2D);
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
    materialIdToTextureBindings.set(material.id, materialTextureBindings);
  }
}

function updateLightUniforms(light: Light, lightUniforms: LightUniforms) {
  const lightWorldPosition = mat4TransformVec3(
    light.localToWorldMatrix,
    new Vec3(0, 0, 0)
  );
  const lightColor = color3MultiplyByScalar(light.color, light.intensity);

  let lightType = LightType.Directional;
  let lightWorldDirection = new Vec3();
  let lightRange = -1;
  let lightInnerCos = -1;
  let lightOuterCos = -1;

  if (light instanceof SpotLight) {
    lightType = LightType.Spot;
    lightWorldDirection = mat4TransformNormal3(
      light.localToWorldMatrix,
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
      light.localToWorldMatrix,
      new Vec3(0, 0, -1)
    );
  }

  lightUniforms.numPunctualLights++;
  lightUniforms.punctualLightType.push(lightType);
  lightUniforms.punctualLightColor.push(lightColor);
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
    materialIdToTextureBindings,
    opaqueMeshBatches,
    blendMeshBatches,
    maskMeshBatches
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
      const material = mesh.material;
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

      const textureBindings = materialIdToTextureBindings.get(material.id);
      if (textureBindings === undefined)
        throw new Error('Texture Bindings not found');

      /*const materialUniformBlock = program.uniformBlocks['Material'];
      const lightingUniformBlock = program.uniformBlocks['Lighting'];
      const cameraUniformBlock = program.uniformBlocks['Camera'];*/

      // create mesh batch
      const meshBatch = new MeshBatch(
        program,
        bufferGeometry,
        programVertexArray,
        uniformValueMaps,
        uniformBufferMap,
        textureBindings
      );
      switch (material.alphaMode) {
        case AlphaMode.Opaque: {
          opaqueMeshBatches.push(meshBatch);

          break;
        }
        case AlphaMode.Blend: {
          blendMeshBatches.push(meshBatch);

          break;
        }
        case AlphaMode.Mask: {
          maskMeshBatches.push(meshBatch);

          break;
        }
        // No default
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
    lightUniforms,
    shaderNameToLightingUniformBuffers
  } = renderCache;
  // console.log('shaderNameToProgram', shaderNameToProgram);

  for (const shaderName of shaderNameToProgram.keys()) {
    // console.log('shaderName', shaderName);
    const program = shaderNameToProgram.get(shaderName);
    if (program === undefined) throw new Error('Program not found');
    const lightingUniformBlock = program.uniformBlocks['Lighting'];
    //console.log('lightingUniformBlock', lightingUniformBlock);
    if (lightingUniformBlock !== undefined) {
      const lightingUniformBuffer =
        lightingUniformBlock.allocateUniformBuffer();
      lightingUniformBlock.setUniformsIntoBuffer(
        lightUniforms as unknown as UniformValueMap,
        lightingUniformBuffer
      );
      //console.log('created lighting uniform buffer', lightUniforms);
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
  // console.log('shaderNameToProgram', shaderNameToProgram);

  for (const shaderName of shaderNameToProgram.keys()) {
    // console.log('shaderName', shaderName);
    const program = shaderNameToProgram.get(shaderName);
    if (program === undefined) throw new Error('Program not found');
    const cameraUniformBlock = program.uniformBlocks['Camera'];
    //console.log('lightingUniformBlock', lightingUniformBlock);
    if (cameraUniformBlock !== undefined) {
      const cameraUniformBuffer = cameraUniformBlock.allocateUniformBuffer();
      cameraUniformBlock.setUniformsIntoBuffer(
        cameraUniforms as unknown as UniformValueMap,
        cameraUniformBuffer
      );
      //console.log('created lighting uniform buffer', lightUniforms);
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
  // console.log('shaderNameToProgram', shaderNameToProgram);

  for (const materialId of materialIdToUniforms.keys()) {
    const materialUniforms = materialIdToUniforms.get(materialId);
    const shaderName = materialIdToMaterial.get(materialId)?.shaderName;
    if (shaderName === undefined) throw new Error('Shader Name not found');
    const program = shaderNameToProgram.get(shaderName);
    if (program === undefined) throw new Error('Program not found');

    const materialUniformBlock = program.uniformBlocks['Material'];
    //console.log('lightingUniformBlock', lightingUniformBlock);
    if (materialUniformBlock !== undefined) {
      const materialUniformBuffer =
        materialUniformBlock.allocateUniformBuffer();
      materialUniformBlock.setUniformsIntoBuffer(
        materialUniforms as unknown as UniformValueMap,
        materialUniformBuffer
      );
      //console.log('created lighting uniform buffer', lightUniforms);
      materialIdToMaterialUniformBuffers.set(materialId, materialUniformBuffer);
    }
  }
}
