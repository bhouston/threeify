import { ShaderMaterial } from '../../materials/ShaderMaterial';
import { Vec3 } from '../../math/Vec3';
import {
  mat4TransformNormal3 as mat4TransformDirection3,
  mat4TransformVec3
} from '../../math/Vec3.Functions';
import { makeBufferGeometryFromGeometry } from '../../renderers/webgl/buffers/BufferGeometry';
import { makeProgramFromShaderMaterial } from '../../renderers/webgl/programs/Program';
import { RenderingContext } from '../../renderers/webgl/RenderingContext';
import { makeTexImage2DFromTexture } from '../../renderers/webgl/textures/TexImage2D.Functions';
import { Camera } from '../../scene/cameras/Camera';
import { DirectionalLight } from '../../scene/lights/DirectionalLight';
import { Light } from '../../scene/lights/Light';
import { LightType } from '../../scene/lights/LightType';
import { PointLight } from '../../scene/lights/PointLight';
import { SpotLight } from '../../scene/lights/SpotLight';
import { Mesh } from '../../scene/Mesh';
import { SceneNode as SceneNode } from '../../scene/SceneNode';
import { breadthFirstVisitor } from '../../scene/Visitors';
import { Texture } from '../../textures/Texture';
import { LightUniforms } from './LightUniforms';
import { NodeUniforms } from './NodeUniforms';
import { SceneCache } from './SceneCache';
import { SceneUniforms } from './SceneUniforms';

export function sceneToSceneCache(
  context: RenderingContext,
  rootNode: SceneNode,
  activeCamera: Camera | undefined,
  shaderResolver: (shaderName: string) => ShaderMaterial
) {
  const sceneCache = new SceneCache();
  const { nodeIdToUniforms, cameraUniforms, lightUniforms } = sceneCache;

  breadthFirstVisitor(rootNode, (node: SceneNode) => {
    const nodeUniforms = new NodeUniforms();
    nodeUniforms.localToWorld = node.localToWorldMatrix;
    nodeIdToUniforms.set(node.id, nodeUniforms);

    if (
      node instanceof Camera &&
      (activeCamera === undefined || node === activeCamera)
    ) {
      cameraToSceneCache(node as Camera, cameraUniforms);
    }

    if (node instanceof Light) {
      lightToSceneCache(node as Light, lightUniforms);
    }

    if (node instanceof Mesh) {
      meshToSceneCache(context, node, shaderResolver, sceneCache);
    }
  });

  return sceneCache;
}

function cameraToSceneCache(camera: Camera, cameraUniforms: SceneUniforms) {
  cameraUniforms.viewToScreen = camera.getProjection(1); // TODO, use a dynamic aspect ratio
  cameraUniforms.worldToView = camera.parentToLocalMatrix;
  cameraUniforms.cameraNear = camera.near;
  cameraUniforms.cameraFar = camera.far;
}

function meshToSceneCache(
  context: RenderingContext,
  mesh: Mesh,
  shaderResolver: (shaderName: string) => ShaderMaterial,
  sceneCache: SceneCache
) {
  const {
    geometryIdToBufferGeometry,
    shaderNameToProgram,
    materialIdToUniforms,
    textureIdToTexImage2D
  } = sceneCache;

  // make buffer geometry
  const geometry = mesh.geometry;
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  geometryIdToBufferGeometry.set(mesh.id, bufferGeometry);

  const material = mesh.material;

  // compile shader program
  if (shaderNameToProgram.get(material.shaderName) === undefined) {
    // get shader material
    const shaderMaterial = shaderResolver(material.shaderName);
    const program = makeProgramFromShaderMaterial(context, shaderMaterial);
    shaderNameToProgram.set(material.shaderName, program);
  }

  // make material uniforms
  if (materialIdToUniforms.get(material.id) === undefined) {
    const materialUniforms = material.getUniforms();

    for (const uniformName of Object.keys(materialUniforms)) {
      const uniformValue = materialUniforms[uniformName];
      if (uniformValue instanceof Texture) {
        const texture = uniformValue as Texture;
        const textureId = texture.id;
        let texImage2D = textureIdToTexImage2D.get(textureId);
        if (texImage2D === undefined) {
          texImage2D = makeTexImage2DFromTexture(context, texture);
          textureIdToTexImage2D.set(textureId, texImage2D);
        }
        materialUniforms[uniformName] = texImage2D;
      }
    }

    materialIdToUniforms.set(material.id, materialUniforms);
  }
}

function lightToSceneCache(light: Light, lightUniforms: LightUniforms) {
  const lightWorldPosition = mat4TransformVec3(
    light.localToWorldMatrix,
    new Vec3(0, 0, 0)
  );
  const lightColor = light.color;

  let lightType = LightType.Directional;
  let lightWorldDirection = new Vec3();
  let lightRange = -1;
  let lightInnerCos = -1;
  let lightOuterCos = -1;

  if (light instanceof SpotLight) {
    lightType = LightType.Spot;
    lightWorldDirection = mat4TransformDirection3(
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
    lightWorldDirection = mat4TransformDirection3(
      light.localToWorldMatrix,
      new Vec3(0, 0, -1)
    );
  }
  lightUniforms.punctualLightType.push(LightType.Spot, lightType);
  lightUniforms.punctualLightColor.push(lightColor);
  lightUniforms.punctualLightWorldPosition.push(lightWorldPosition);
  lightUniforms.punctualLightWorldDirection.push(lightWorldDirection);
  lightUniforms.punctualLightRange.push(lightRange);
  lightUniforms.punctualLightInnerCos.push(lightInnerCos);
  lightUniforms.punctualLightOuterCos.push(lightOuterCos);
}
