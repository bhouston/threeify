export enum GLTFModel {
  DamagedHelmet,
  AntiqueCamera,
  BoomBox,
  BoxTextured,
  Duck,
  DragonAttenuation,
  CesiumMilkTruck,
  WaterBottle,
  TextureEncodingTest,
  TextureCoordinateTest,
  SpecularTest,
  MetalRoughSpheresNoTexture,
  MetalRoughSpheres,
  IridescenceLamp,
  GlamVelvetSofa,
  BoxTexturedNonPowerOfTwo,
  GearboxAssy,
  Lantern,
  Avocado
}

export enum GLTFFormat {
  glTF,
  glTFBinary,
  glTFDraco,
  glTFEmbedded
}

const glTFFormatToFolder = {
  [GLTFFormat.glTF]: 'glTF',
  [GLTFFormat.glTFBinary]: 'glTF-Binary',
  [GLTFFormat.glTFDraco]: 'glTF-Draco',
  [GLTFFormat.glTFEmbedded]: 'glTF-Embedded'
};

const glTFFormatToExtension = {
  [GLTFFormat.glTF]: 'gltf',
  [GLTFFormat.glTFBinary]: 'glb',
  [GLTFFormat.glTFDraco]: 'gltf',
  [GLTFFormat.glTFEmbedded]: 'gltf'
};

export function getGLTFUrl(model: GLTFModel, format: GLTFFormat): string {
  const modelName = GLTFModel[model];
  const formatFolder = glTFFormatToFolder[format];
  const extension = glTFFormatToExtension[format];
  return `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/${modelName}/${formatFolder}/${modelName}.${extension}`;
}
