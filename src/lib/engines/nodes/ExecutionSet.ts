import { MaterialUniforms } from '../../materials/Material';
import { ShaderMaterial } from '../../materials/ShaderMaterial';
import { Color3 } from '../../math/Color3';
import { Mat4 } from '../../math/Mat4';
import { mat4Inverse } from '../../math/Mat4.Functions';
import { Vec3 } from '../../math/Vec3';
import {
  mat4TransformNormal3 as mat4TransformDirection3,
  mat4TransformVec3
} from '../../math/Vec3.Functions';
import { Camera } from '../../nodes/cameras/Camera';
import { DirectionalLight } from '../../nodes/lights/DirectionalLight';
import { Light } from '../../nodes/lights/Light';
import { LightType } from '../../nodes/lights/LightType';
import { PointLight } from '../../nodes/lights/PointLight';
import { SpotLight } from '../../nodes/lights/SpotLight';
import { Mesh } from '../../nodes/Mesh';
import { Node } from '../../nodes/Node';
import { breadthFirstVisitor } from '../../nodes/Visitors';
import {
  BufferGeometry,
  makeBufferGeometryFromGeometry
} from '../../renderers/webgl/buffers/BufferGeometry';
import { BufferBit } from '../../renderers/webgl/framebuffers/BufferBit';
import {
  renderBufferGeometry,
  VirtualFramebuffer
} from '../../renderers/webgl/framebuffers/VirtualFramebuffer';
import {
  makeProgramFromShaderMaterial,
  Program
} from '../../renderers/webgl/programs/Program';
import { RenderingContext } from '../../renderers/webgl/RenderingContext';
import { TexImage2D } from '../../renderers/webgl/textures/TexImage2D';
import { makeTexImage2DFromTexture } from '../../renderers/webgl/textures/TexImage2D.Functions';
import { Texture } from '../../textures/Texture';
export class NodeUniforms {
  public localToWorld = new Mat4();
}

export class SceneUniforms {
  public worldToView = new Mat4();
  public viewToScreen = new Mat4();
  public cameraPosition = new Vec3();
  public cameraNear = 0;
  public cameraFar = 0;
}

export class LightUniforms {
  public numPunctualLights = 0;
  public punctualLightType: number[] = [];
  public punctualLightWorldPosition: Vec3[] = [];
  public punctualLightWorldDirection: Vec3[] = [];
  public punctualLightColor: Color3[] = [];
  public punctualLightRange: number[] = [];
  public punctualLightInnerCos: number[] = [];
  public punctualLightOuterCos: number[] = [];
}

export class ExecutionSet {
  public cameraUniforms = new SceneUniforms();
  public lightUniforms = new LightUniforms();
  public geometryIdToBufferGeometry: Map<string, BufferGeometry> = new Map();
  public shaderNameToProgram: Map<string, Program> = new Map();
  public materialIdToUniforms: Map<string, MaterialUniforms> = new Map();
  public nodeIdToUniforms: Map<string, NodeUniforms> = new Map();
  public textureIdToTexImage2D: Map<string, TexImage2D> = new Map();
}

export function compileNodeTreeToExecutionSet(
  context: RenderingContext,
  rootNode: Node,
  activeCamera: Camera | undefined,
  shaderResolver: (shaderName: string) => ShaderMaterial
) {
  const executionSet = new ExecutionSet();
  const {
    geometryIdToBufferGeometry,
    shaderNameToProgram,
    materialIdToUniforms,
    nodeIdToUniforms,
    textureIdToTexImage2D,
    cameraUniforms,
    lightUniforms
  } = executionSet;

  let cameraEncountered = false;

  breadthFirstVisitor(rootNode, (node: Node) => {
    const nodeUniforms = new NodeUniforms();
    nodeUniforms.localToWorld = node.localToWorld;
    nodeIdToUniforms.set(node.id, nodeUniforms);

    if (node instanceof Camera) {
      const camera = node as Camera;
      if (activeCamera !== undefined && camera !== activeCamera) {
        return;
      }
      if (cameraEncountered) {
        throw new Error('Only one camera is allowed in the scene');
      }
      cameraUniforms.viewToScreen = camera.getProjection(1); // TODO, use a dynamic aspect ratio
      cameraUniforms.worldToView = mat4Inverse(camera.localToParent);
      cameraUniforms.cameraNear = camera.near;
      cameraUniforms.cameraFar = camera.far;
      cameraEncountered = true;
    }

    if (node instanceof Light) {
      const light = node as Light;

      const lightWorldPosition = mat4TransformVec3(
        light.localToWorld,
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
        lightWorldDirection = mat4TransformDirection3(
          light.localToWorld,
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

    if (node instanceof Mesh) {
      const mesh = node as Mesh;

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
  });

  if (!cameraEncountered) {
    throw new Error('No camera in scene, unsure how to render this');
  }

  return executionSet;
}

export function renderSceneViaExecutionSet(
  framebuffer: VirtualFramebuffer,
  rootNode: Node,
  executionSet: ExecutionSet
) {
  // render nodes
  breadthFirstVisitor(rootNode, (node: Node) => {
    if (node instanceof Mesh) {
      const mesh = node as Mesh;
      renderMeshViaExecutionSet(framebuffer, mesh, executionSet);
    }
  });
}

function renderMeshViaExecutionSet(
  framebuffer: VirtualFramebuffer
  mesh: Mesh,
  executionSet: ExecutionSet,
) {
  const {
    cameraUniforms: sceneUniforms,
    geometryIdToBufferGeometry,
    shaderNameToProgram,
    materialIdToUniforms,
    nodeIdToUniforms,
    lightUniforms
  } = executionSet;

  // get buffer geometry
  const bufferGeometry = geometryIdToBufferGeometry.get(mesh.id);
  if (bufferGeometry === undefined)
    throw new Error('Buffer Geometry not found');

  // get shader program
  const shaderMaterial = mesh.material;
  const program = shaderNameToProgram.get(shaderMaterial.shaderName);
  if (program === undefined) throw new Error('Program not found');

  // get material uniforms
  const materialUniforms = materialIdToUniforms.get(shaderMaterial.id);
  if (materialUniforms === undefined)
    throw new Error('Material Uniforms not found');

  // get node uniforms
  const nodeUniforms = nodeIdToUniforms.get(mesh.id);
  if (nodeUniforms === undefined) throw new Error('Node Uniforms not found');

  // combine uniforms
  const uniforms = {
    ...materialUniforms,
    ...nodeUniforms,
    ...sceneUniforms,
    ...lightUniforms
  };

  framebuffer.clear(BufferBit.All);
  renderBufferGeometry(framebuffer, program, uniforms, bufferGeometry);
}
