import {
  Mesh,
  Node,
  Texture as GLTFTexture,
  TextureInfo,
  WebIO
} from '@gltf-transform/core';
import {
  Clearcoat,
  EmissiveStrength,
  IOR,
  Iridescence,
  KHRONOS_EXTENSIONS,
  Sheen,
  Specular,
  Transform as TextureTransform,
  Transmission,
  Volume
} from '@gltf-transform/extensions';
import {
  AlphaMode,
  Attribute,
  AttributeData,
  createImageBitmapFromArrayBuffer,
  Geometry,
  Texture
} from '@threeify/core';
import {
  Color3,
  color3MultiplyByScalar,
  composeMat3,
  Mat3,
  Quat,
  Vec2,
  Vec3
} from '@threeify/math';

import { PhysicalMaterial } from '../materials/PhysicalMaterial';
import { TextureAccessor } from '../materials/TextureAccessor';
import { MeshNode } from '../scene/Mesh';
import { SceneNode } from '../scene/SceneNode';

const semanticToThreeifyName: { [key: string]: string } = {
  POSITION: 'position',
  NORMAL: 'normal',
  TANGENT: 'tangent',
  TEXCOORD_0: 'uv0',
  TEXCOORD_1: 'uv1',
  TEXCOORD_2: 'uv2',
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
  const mimeType = texture?.getMimeType() || 'image/png';
  const name =
    (texture?.getName() || texture?.getURI() || '') +
    `(${mimeType}) ${size.x}x${size.y}`;
  //console.time('createImageBitmapFromArrayBuffer ' + name);
  const imageBitmap = await createImageBitmapFromArrayBuffer(
    imageData,
    mimeType
  );
  //console.timeEnd('createImageBitmapFromArrayBuffer ' + name);
  const result = new Texture(imageBitmap);
  result.name = name;
  return result;
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
  /*io.registerExtensions([
    MeshoptCompression,
    MeshQuantization
  ]);

  await MeshoptDecoder.ready;
  await MeshoptEncoder.ready;

  io.registerDependencies({
    'meshopt.decoder': MeshoptDecoder,
    'meshopt.encoder': MeshoptEncoder
  });*/

  /*const dracoDecoder = await import('/assets/gltf-draco/draco_decoder.js');

  const decoder = await dracoDecoder.createDecoderModule();

  io.registerDependencies({
    'draco3d.decoder': decoder
  });*/

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
    sceneNode.children.push(...(await translateMeshes(glTFMesh)));
  }

  for (const glTFChildNode of glTFNode.listChildren()) {
    sceneNode.children.push(await translateNode(glTFChildNode));
  }

  return sceneNode;
}

function getUVTransform(textureInfo: TextureInfo | null): Mat3 {
  if (textureInfo === null) return new Mat3();
  const extension = textureInfo?.getExtension('KHR_texture_transform');
  if (extension === null) return new Mat3();
  const glTFTransform = extension as TextureTransform;
  const translation = toVec2(glTFTransform.getOffset());
  const rotation = glTFTransform.getRotation();
  const scale = toVec2(glTFTransform.getScale());
  return composeMat3(translation, rotation, scale);
}

function getUVIndex(textureInfo: TextureInfo | null): number {
  if (textureInfo === null) return 0;
  const extension = textureInfo?.getExtension('KHR_texture_transform');
  if (extension === null) return 0;
  const glTFTransform = extension as TextureTransform;
  const uvIndex = glTFTransform.getTexCoord();
  if (uvIndex === null) return 0;
  return uvIndex;
}

async function getTextureAccessor(
  glTFTexture: GLTFTexture | null,
  textureInfo: TextureInfo | null
): Promise<TextureAccessor | undefined> {
  const texture = await toTexture(glTFTexture);
  if (texture === undefined) return undefined;
  const uvTransform = getUVTransform(textureInfo);
  const uvIndex = getUVIndex(textureInfo);
  return new TextureAccessor(texture, uvTransform, uvIndex);
}

async function translateMeshes(glTFMesh: Mesh): Promise<MeshNode[]> {
  const meshNodes: MeshNode[] = [];

  for (const primitive of glTFMesh.listPrimitives()) {
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

      const glTFIor = glTFMaterial.getExtension('KHR_materials_ior') as IOR;
      const glTFSpecular = glTFMaterial.getExtension(
        'KHR_materials_specular'
      ) as Specular;
      const glTFEmissiveStrength = glTFMaterial.getExtension(
        'KHR_materials_emissive_strength'
      ) as EmissiveStrength;
      const glTFClearcoat = glTFMaterial.getExtension(
        'KHR_materials_clearcoat'
      ) as Clearcoat;
      const glTFSheen = glTFMaterial.getExtension(
        'KHR_materials_sheen'
      ) as Sheen;
      const glTFIridescence = glTFMaterial.getExtension(
        'KHR_materials_iridescence'
      ) as Iridescence;
      const glTFTransmission = glTFMaterial.getExtension(
        'KHR_materials_transmission'
      ) as Transmission;
      const glTFVolume = glTFMaterial.getExtension(
        'KHR_materials_volume'
      ) as Volume;

      const metallicRoughnessTextureAccessorPromise = getTextureAccessor(
        glTFMaterial.getMetallicRoughnessTexture(),
        glTFMaterial.getMetallicRoughnessTextureInfo()
      );
      const albedoAlphaTextureAccessorPromise = getTextureAccessor(
        glTFMaterial.getBaseColorTexture(),
        glTFMaterial.getBaseColorTextureInfo()
      );
      const emissiveTextureAccessorPromise = getTextureAccessor(
        glTFMaterial.getEmissiveTexture(),
        glTFMaterial.getEmissiveTextureInfo()
      );
      const normalTextureAccessorPromise = getTextureAccessor(
        glTFMaterial.getNormalTexture(),
        glTFMaterial.getNormalTextureInfo()
      );

      const occlusionTextureAccessorPromise = getTextureAccessor(
        glTFMaterial.getOcclusionTexture(),
        glTFMaterial.getOcclusionTextureInfo()
      );

      const specularFactorTextureAccessorPromise = getTextureAccessor(
        glTFSpecular?.getSpecularTexture() || null,
        glTFSpecular?.getSpecularTextureInfo() || null
      );

      const specularColorTextureAccessorPromise = getTextureAccessor(
        glTFSpecular?.getSpecularColorTexture() || null,
        glTFSpecular?.getSpecularColorTextureInfo() || null
      );

      if (glTFClearcoat !== null) {
        if (
          glTFClearcoat?.getClearcoatTexture() !== null &&
          glTFClearcoat?.getClearcoatRoughnessTexture() !== null
        ) {
          if (
            glTFClearcoat?.getClearcoatTexture() !==
            glTFClearcoat?.getClearcoatRoughnessTexture()
          ) {
            throw new Error(
              'Clearcoat and Clearcoat Roughness textures must be the same.'
            );
          }
        }
      }

      const clearcoatFactorRoughnessTextureAccessorPromise = getTextureAccessor(
        glTFClearcoat?.getClearcoatTexture() || null,
        glTFClearcoat?.getClearcoatTextureInfo() || null
      );
      const clearcoatNormalTextureAccessorPromise = getTextureAccessor(
        glTFClearcoat?.getClearcoatNormalTexture() || null,
        glTFClearcoat?.getClearcoatNormalTextureInfo() || null
      );

      if (glTFSheen !== null) {
        if (
          glTFSheen?.getSheenColorTexture() !== null &&
          glTFSheen?.getSheenRoughnessTexture() !== null
        ) {
          if (
            glTFSheen?.getSheenColorTexture() !==
            glTFSheen?.getSheenRoughnessTexture()
          ) {
            throw new Error(
              'Sheen Color and Roughness textures must be the same.'
            );
          }
        }
      }

      const sheenColorRoughnessTextureAccessorPromise = getTextureAccessor(
        glTFSheen?.getSheenColorTexture() || null,
        glTFSheen?.getSheenColorTextureInfo() || null
      );

      if (glTFIridescence !== null) {
        if (
          glTFIridescence?.getIridescenceTexture() !== null &&
          glTFIridescence?.getIridescenceThicknessTexture() !== null
        ) {
          if (
            glTFIridescence?.getIridescenceTexture() !==
            glTFIridescence?.getIridescenceThicknessTexture()
          ) {
            throw new Error(
              'Sheen Color and Roughness textures must be the same.'
            );
          }
        }
      }

      const iridescenceFactorThicknessTextureAccessorPromise =
        getTextureAccessor(
          glTFIridescence?.getIridescenceTexture() || null,
          glTFIridescence?.getIridescenceTextureInfo() || null
        );

      if (glTFTransmission !== null && glTFVolume !== null) {
        if (
          glTFTransmission?.getTransmissionTexture() !== null &&
          glTFVolume?.getThicknessTexture() !== null
        ) {
          if (
            glTFTransmission?.getTransmissionTexture() !==
            glTFVolume?.getThicknessTexture()
          ) {
            throw new Error(
              'Sheen Color and Roughness textures must be the same.'
            );
          }
        }
      }

      const transmissionFactorThicknessTextureAccessorPromise =
        getTextureAccessor(
          glTFTransmission?.getTransmissionTexture(),
          glTFTransmission?.getTransmissionTextureInfo()
        );

      const data = await Promise.all([
        metallicRoughnessTextureAccessorPromise,
        albedoAlphaTextureAccessorPromise,
        emissiveTextureAccessorPromise,
        normalTextureAccessorPromise,
        occlusionTextureAccessorPromise,
        specularFactorTextureAccessorPromise,
        specularColorTextureAccessorPromise,
        clearcoatFactorRoughnessTextureAccessorPromise,
        clearcoatNormalTextureAccessorPromise,
        sheenColorRoughnessTextureAccessorPromise,
        iridescenceFactorThicknessTextureAccessorPromise,
        transmissionFactorThicknessTextureAccessorPromise
      ]);

      const metallicRoughnessTextureAccessor = data[0];
      const albedoAlphaTextureAccessor = data[1];
      const emissiveTextureAccessor = data[2];
      const normalTextureAccessor = data[3];
      const occlusionTextureAccessor = data[4];
      const specularFactorTextureAccessor = data[5];
      const specularColorTextureAccessor = data[6];
      const clearcoatFactorRoughnessTextureAccessor = data[7];
      const clearcoatNormalTextureAccessor = data[8];
      const sheenColorRoughnessTextureAccessor = data[9];
      const iridescenceFactorThicknessTextureAccessor = data[10];
      const transmissionFactorThicknessTextureAccessor = data[11];

      physicalMaterial = new PhysicalMaterial({
        alpha: glTFMaterial.getAlpha(),
        alphaMode: toAlphaMode(glTFMaterial.getAlphaMode()),
        alphaCutoff: glTFMaterial.getAlphaCutoff(),

        albedoFactor: toColor3(glTFMaterial.getBaseColorFactor()),
        albedoAlphaTextureAccessor: albedoAlphaTextureAccessor,

        specularRoughnessFactor: glTFMaterial.getRoughnessFactor(),
        metallicFactor: glTFMaterial.getMetallicFactor(),
        metallicSpecularRoughnessTextureAccessor:
          metallicRoughnessTextureAccessor,

        emissiveFactor: color3MultiplyByScalar(
          toColor3(glTFMaterial.getEmissiveFactor()),
          glTFEmissiveStrength !== null
            ? glTFEmissiveStrength.getEmissiveStrength()
            : 1
        ),
        emissiveTextureAccessor: emissiveTextureAccessor,

        normalScale: toVec2([
          glTFMaterial.getNormalScale(),
          glTFMaterial.getNormalScale()
        ]),
        normalTextureAccessor: normalTextureAccessor,

        occlusionFactor: glTFMaterial.getOcclusionStrength(),
        occlusionTextureAccessor: occlusionTextureAccessor,

        ior: glTFIor?.getIOR(),

        specularFactor: glTFSpecular?.getSpecularFactor(),
        specularFactorTextureAccessor: specularFactorTextureAccessor,
        specularColor:
          glTFSpecular !== null
            ? toColor3(glTFSpecular.getSpecularColorFactor())
            : undefined,
        specularColorTextureAccessor: specularColorTextureAccessor,

        clearcoatFactor: glTFClearcoat?.getClearcoatFactor(),
        clearcoatRoughnessFactor: glTFClearcoat?.getClearcoatRoughnessFactor(),
        clearcoatFactorRoughnessTextureAccessor:
          clearcoatFactorRoughnessTextureAccessor,
        clearcoatNormalTextureAccessor: clearcoatNormalTextureAccessor,

        sheenColorFactor:
          glTFSheen !== null
            ? toColor3(glTFSheen.getSheenColorFactor())
            : undefined,
        sheenRoughnessFactor: glTFSheen?.getSheenRoughnessFactor(),
        sheenColorRoughnessTextureAccessor: sheenColorRoughnessTextureAccessor,

        iridescenceFactor: glTFIridescence?.getIridescenceFactor(),
        iridescenceIor: glTFIridescence?.getIridescenceIOR(),
        iridescenceThicknessMinimum:
          glTFIridescence?.getIridescenceThicknessMaximum(),
        iridescenceThicknessMaximum:
          glTFIridescence?.getIridescenceThicknessMaximum(),
        iridescenceFactorThicknessTextureAccessor:
          iridescenceFactorThicknessTextureAccessor,

        transmissionFactor: glTFTransmission?.getTransmissionFactor(),
        thicknessFactor: glTFVolume?.getThicknessFactor(),
        transmissionFactorThicknessTextureAccessor:
          transmissionFactorThicknessTextureAccessor,

        attenuationDistance: glTFVolume?.getAttenuationDistance(),
        attenuationColor:
          glTFVolume !== null
            ? toColor3(glTFVolume?.getAttenuationColor())
            : undefined
      });
    }

    meshNodes.push(
      new MeshNode({
        name: 'glTFMesh',
        geometry,
        material: physicalMaterial
      })
    );
  }
  return meshNodes;
}
