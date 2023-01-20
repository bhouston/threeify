import { Mesh, WebIO } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import {
  Attribute,
  AttributeData,
  ComponentType,
  Geometry,
  geometryToBoundingBox,
  makeFloat32Attribute,
  mat4FromArray,
  PhysicalMaterial,
  Vec3,
  Quat
} from '@threeify/core';
import { MeshNode } from '../scene/Mesh';
import { SceneNode } from '../scene/SceneNode';

const semanticToThreeifyName: { [key: string]: string } = {
  POSITION: 'position',
  NORMAL: 'normal',
  TANGENT: 'tangent',
  TEXCOORD_0: 'uv0',
  TEXCOORD_1: 'uv1',
  COLOR_0: 'color0',
  JOINTS_0: 'joints0',
  WEIGHTS_0: 'weights0'
};

function toVec3(values: number[]): Vec3 {
  return new Vec3(values[0], values[1], values[2]);
}
function toQuat(values: number[]): Quat {
  return new Quat(values[0], values[1], values[2], values[3]);
}
export async function glTFToSceneNode(url: string): Promise<SceneNode> {
  const io = new WebIO();
  io.registerExtensions(KHRONOS_EXTENSIONS);

  const document = await io.read(url);
  const root = document.getRoot();
  const scene = root.listScenes()[0];

  const rootNode = new SceneNode();

  scene.listChildren().forEach((node) => {
    const translation = toVec3(node.getTranslation());
    const rotation = toQuat(node.getRotation());
    const scale = toVec3(node.getScale());

    const mesh = node.getMesh();
    if (mesh !== null) {
      const geometry = new Geometry();
      mesh.listPrimitives().forEach((primitive) => {
        console.log('primitive', primitive.getName(), primitive);
        console.log('indices', primitive.getIndices());
        const indices = primitive.getIndices();
        if (indices !== null) {
          geometry.indices = new Attribute(
            new AttributeData(indices.getArray() || new Float32Array()),
            indices.getElementSize(),
            indices.getComponentType(),
            -1,
            0,
            indices.getNormalized()
          );
        }
        primitive.listSemantics().forEach((semantic, index) => {
          const attribute = primitive.listAttributes()[index];

          geometry.attributes[semanticToThreeifyName[semantic]] = new Attribute(
            new AttributeData(attribute.getArray() || new Float32Array()),
            attribute.getElementSize(),
            attribute.getComponentType(),
            -1,
            0,
            attribute.getNormalized()
          );
        });
      });

      const material = new PhysicalMaterial({});
      const meshNode = new MeshNode({
        translation,
        scale,
        rotation,
        geometry,
        material
      });
      const bb = geometryToBoundingBox(geometry);
      console.log('boundingBox', bb);
      rootNode.children.push(meshNode);
    } else {
      const localNode = new SceneNode({ translation, scale, rotation });

      rootNode.children.push(localNode);
    }
  });

  return new Promise<SceneNode>((resolve) => {
    resolve(rootNode);
  });
}
