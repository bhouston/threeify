import {
  BufferGeometry,
  CubeMapTexture,
  Geometry,
  geometryToBufferGeometry,
  getTransformToUnitSphere,
  NormalCube,
  Program,
  ProgramUniform,
  ProgramVertexArray,
  RenderingContext,
  TexImage2D,
  Texture,
  TextureFilter,
  textureToTexImage2D,
  UniformValueMap,
  VirtualFramebuffer
} from '@threeify/core';
import {
  color3MultiplyByScalar,
  Mat4,
  mat4Inverse,
  mat4TransformNormal3,
  mat4TransformPosition3,
  Vec2,
  Vec3
} from '@threeify/math';

import { GemMaterial } from '../materials/GemMaterial';
import { MaterialParameters } from '../materials/MaterialParameters';
import { RenderLayer } from '../materials/RenderLayer';
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
    nodeUniforms.worldToLocal.copy(node.worldToLocal);

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

  createMeshBatches(renderCache);

  return renderCache;
}

function updateCameraUniforms(
  camera: CameraNode,
  cameraUniforms: CameraUniforms
) {
  cameraUniforms.viewToClip.copy(camera.getViewToClipProjection()); // TODO, use a dynamic aspect ratio
  cameraUniforms.worldToView.copy(camera.worldToView);
  cameraUniforms.viewToWorld.copy(camera.viewToWorld);
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

  let gemNormalCubeMap: TexImage2D | undefined = undefined;
  if (material instanceof GemMaterial) {
    const bufferGeometry = geometryIdToBufferGeometry.get(geometry.id);
    if (bufferGeometry === undefined)
      throw new Error('buffer geometry not found');
    gemNormalCubeMap = createGemNormalCubeMap(
      renderCache,
      geometry,
      bufferGeometry,
      material
    );
  }

  // make material uniforms
  if (!materialIdToUniforms.has(material.id)) {
    const materialParameters = flattenMaterialParameters(
      material.getParameters()
    );
    console.log('material parameters', materialParameters);
    const materialUniforms: UniformValueMap = {};
    if (gemNormalCubeMap !== undefined) {
      materialUniforms['gemNormalCubeMap'] = gemNormalCubeMap;
    }
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
  const lightWorldPosition = mat4TransformPosition3(
    light.localToWorld,
    Vec3.Zero
  );
  const lightIntensity = color3MultiplyByScalar(light.color, light.intensity);

  let lightType = LightType.Directional;
  let lightWorldDirection = new Vec3();
  let lightRange = -1;
  let lightInnerCos = -1;
  let lightOuterCos = -1;

  if (light instanceof DomeLight) {
    lightUniforms.iblWorldMap =
      light.cubeMap !== undefined
        ? light.cubeMap instanceof CubeMapTexture
          ? textureToTexImage2D(context, light.cubeMap)
          : light.cubeMap
        : undefined;
    lightUniforms.iblIntensity = color3MultiplyByScalar(
      light.color,
      light.intensity
    );
    if (lightUniforms.iblWorldMap !== undefined) {
      lightUniforms.iblMipCount = lightUniforms.iblWorldMap.mipCount;
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
      uniformValueMaps.push(nodeUniforms as unknown as UniformValueMap);

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

      // create mesh batch
      const meshBatch = new MeshBatch(
        program,
        bufferGeometry,
        programVertexArray,
        uniformValueMaps
      );
      if (material.getRenderLayer() === RenderLayer.Transparent) {
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

function createGemNormalCubeMap(
  renderCache: RenderCache,
  geometry: Geometry,
  bufferGeometry: BufferGeometry,
  gemMaterial: GemMaterial
) {
  const { gemIdToNormalCubeMap, context, normalCube } = renderCache;
  const smoothNormals = false;
  const gemId = gemMaterial.gemNormalCubeMapId;

  const localToGem = getTransformToUnitSphere(geometry);
  gemMaterial.localToGem.copy(localToGem);
  gemMaterial.gemToLocal.copy(mat4Inverse(localToGem));

  let normalCubeMap = gemIdToNormalCubeMap.get(gemId);
  if (normalCubeMap === undefined) {
    normalCubeMap = getGemNormalCubeMap(
      bufferGeometry,
      smoothNormals,
      normalCube,
      gemMaterial.localToGem,
      context
    );
    gemIdToNormalCubeMap.set(gemId, normalCubeMap);
  }
  return normalCubeMap;
}

function getGemNormalCubeMap(
  bufferGeometry: BufferGeometry,
  smoothNormals: boolean,
  normalCube: NormalCube,
  localToGem: Mat4,
  context: RenderingContext
): TexImage2D {
  const imageSize = new Vec2(1024, 1024);
  const normalCubeTexture = new CubeMapTexture([
    imageSize,
    imageSize,
    imageSize,
    imageSize,
    imageSize,
    imageSize
  ]);
  normalCubeTexture.minFilter = smoothNormals
    ? TextureFilter.Linear
    : TextureFilter.Nearest;
  normalCubeTexture.magFilter = smoothNormals
    ? TextureFilter.Linear
    : TextureFilter.Nearest;
  normalCubeTexture.anisotropicLevels = 0;
  normalCubeTexture.generateMipmaps = false;
  const normalCubeMap = textureToTexImage2D(context, normalCubeTexture);

  normalCube.exec({
    cubeMap: normalCubeMap,
    localToCube: localToGem,
    bufferGeometry
  });

  return normalCubeMap;
}
