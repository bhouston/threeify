import {
  Mesh,
  Node,
  Texture as GLTFTexture,
  WebIO
} from '@gltf-transform/core';
import { Clearcoat, KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import {
  AlphaMode,
  Attribute,
  AttributeData,
  Color3,
  createImageBitmapFromArrayBuffer,
  Geometry,
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

function toAlphaMode(alphaMode: string): AlphaMode {
  switch (alphaMode) {
    case 'BLEND':
      return AlphaMode.Blend;
    case 'MASK':
      return AlphaMode.Mask;
    case 'OPAQUE':
      return AlphaMode.Opaque;
    default:
      return AlphaMode.Opaque;
  }
}
export async function glTFToSceneNode(url: string): Promise<SceneNode> {
  const io = new WebIO();
  io.registerExtensions(KHRONOS_EXTENSIONS);

  const document = await io.read(url);
  const glTFRoot = document.getRoot();
  const glTFScene = glTFRoot.listScenes()[0];

  const rootNode = new SceneNode({ name: 'glTF' });

  for (const glTFChildNode of glTFScene.listChildren()) {
    rootNode.children.push(await translateNode(glTFChildNode));
  }
  return rootNode;
}

async function translateNode(glTFNode: Node): Promise<SceneNode> {
  const translation = toVec3(glTFNode.getTranslation());
  const rotation = toQuat(glTFNode.getRotation());
  const scale = toVec3(glTFNode.getScale());

  const sceneNode = new SceneNode({ translation, scale, rotation });

  const glTFMesh: Mesh | null = glTFNode.getMesh();
  if (glTFMesh !== null) {
    sceneNode.children.push(await translateMesh(glTFMesh));
  }

  for (const glTFChildNode of glTFNode.listChildren()) {
    sceneNode.children.push(await translateNode(glTFChildNode));
  }

  return sceneNode;
}

async function translateMesh(glTFMesh: Mesh): Promise<MeshNode> {
  if (glTFMesh.listPrimitives().length > 1) {
    console.log('mesh.listPrimitives()', glTFMesh.listPrimitives());
    //throw new Error('Mesh has more than one primitive');
  }

  const primitive = glTFMesh.listPrimitives()[0];

  const geometry = new Geometry();
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

    const threekitName = semanticToThreeifyName[semantic];
    if (threekitName === undefined)
      throw new Error(`Unknown semantic ${semantic}`);

    geometry.attributes[semanticToThreeifyName[semantic]] = new Attribute(
      new AttributeData(attribute.getArray() || new Float32Array()),
      attribute.getElementSize(),
      attribute.getComponentType(),
      -1,
      0,
      attribute.getNormalized()
    );
  });

  const glTFMaterial = primitive.getMaterial();

  if (glTFMaterial !== null) {
    // convert to simultaneously resolving promises

    const metallicRoughnessTexture = await toTexture(
      glTFMaterial.getMetallicRoughnessTexture()
    );
    const albedoAlphaTexture = await toTexture(
      glTFMaterial.getBaseColorTexture()
    );

    const glTFClearcoat = glTFMaterial.getExtension(
      'KHR_materials_clearcoat'
    ) as Clearcoat;

    physicalMaterial = new PhysicalMaterial({
      albedoFactor: toColor3(glTFMaterial.getBaseColorFactor()),
      albedoTexture: albedoAlphaTexture,
      alpha: glTFMaterial.getAlpha(),
      alphaTexture: albedoAlphaTexture,
      alphaMode: toAlphaMode(glTFMaterial.getAlphaMode()),
      alphaCutoff: glTFMaterial.getAlphaCutoff(),
      metallicFactor: glTFMaterial.getMetallicFactor(),
      metallicTexture: metallicRoughnessTexture,
      specularRoughnessFactor: glTFMaterial.getRoughnessFactor(),
      specularRoughnessTexture: metallicRoughnessTexture,
      emissiveFactor: toColor3(glTFMaterial.getEmissiveFactor()),
      emissiveTexture: await toTexture(glTFMaterial.getEmissiveTexture()),
      normalScale: toVec2([
        glTFMaterial.getNormalScale(),
        glTFMaterial.getNormalScale()
      ]),
      normalTexture: await toTexture(glTFMaterial.getNormalTexture()),
      occlusionFactor: glTFMaterial.getOcclusionStrength(),
      occlusionTexture: await toTexture(glTFMaterial.getOcclusionTexture()),
      clearcoatFactor: glTFClearcoat?.getClearcoatFactor() || 0,
      clearcoatRoughnessFactor:
        glTFClearcoat?.getClearcoatRoughnessFactor() || 0,
      clearcoatTexture:
        glTFClearcoat?.getClearcoatTexture() !== null
          ? await toTexture(glTFClearcoat?.getClearcoatTexture())
          : undefined,
      clearcoatRoughnessTexture:
        glTFClearcoat?.getClearcoatRoughnessTexture() !== null
          ? await toTexture(glTFClearcoat?.getClearcoatRoughnessTexture())
          : undefined
    });
  }

  return new MeshNode({
    name: 'glTFMesh',
    geometry,
    material: physicalMaterial
  });
}
