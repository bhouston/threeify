import { Texture as GLTFTexture, WebIO } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import {
  Attribute,
  AttributeData,
  Color3,
  createImageBitmapFromArrayBuffer,
  Geometry,
  geometryToBoundingBox,
  PhysicalMaterial,
  Quat,
  Texture,
  Vec2,
  Vec3
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

async function toTexture(
  texture: GLTFTexture | null
): Promise<Texture | undefined> {
  const size = toVec2(texture?.getSize() || [1, 1]);
  const imageData = texture?.getImage();
  if (imageData === null || imageData === undefined) {
    return undefined;
  }
  const imageBitmap = await createImageBitmapFromArrayBuffer(
    imageData,
    texture?.getMimeType() || 'image/png'
  );
  return new Texture(imageBitmap);
}

function toColor3(values: number[]): Color3 {
  return new Color3(values[0], values[1], values[2]);
}

function toVec2(values: number[]): Vec2 {
  return new Vec2(values[0], values[1]);
}
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

  for (const node of scene.listChildren()) {
    const translation = toVec3(node.getTranslation());
    const rotation = toQuat(node.getRotation());
    const scale = toVec3(node.getScale());

    const localNode = new SceneNode({ translation, scale, rotation });
    rootNode.children.push(localNode);

    const mesh = node.getMesh();
    if (mesh !== null) {
      const geometry = new Geometry();
      for (const primitive of mesh.listPrimitives()) {
        let physicalMaterial = new PhysicalMaterial({});

        geometry.primitive = primitive.getMode();

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
        const material = primitive.getMaterial();

        if (material !== null) {
          const metallicRoughnessTexture = await toTexture(
            material.getMetallicRoughnessTexture()
          );
          physicalMaterial = new PhysicalMaterial({
            albedo: toColor3(material.getBaseColorFactor()),
            albedoTexture: await toTexture(material.getBaseColorTexture()),
            metallic: material.getMetallicFactor(),
            metallicTexture: metallicRoughnessTexture,
            specularRoughness: material.getRoughnessFactor(),
            specularRoughnessTexture: metallicRoughnessTexture,
            emissiveColor: toColor3(material.getEmissiveFactor()),
            emissiveTexture: await toTexture(material.getEmissiveTexture()),
            normalScale: toVec2([
              material.getNormalScale(),
              material.getNormalScale()
            ]),
            normalTexture: await toTexture(material.getNormalTexture())
          });

          const meshNode = new MeshNode({
            translation,
            scale,
            rotation,
            geometry,
            material: physicalMaterial
          });
          const bb = geometryToBoundingBox(geometry);
          localNode.children.push(meshNode);
        }
      }
    }
  }

  return new Promise<SceneNode>((resolve) => {
    resolve(rootNode);
  });
}
