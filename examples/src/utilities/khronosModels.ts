export enum KhronosModel {
  ABeautifulGame,
  BarramundiFish,
  BrainStem,
  Buggy,
  CesiumMan,
  Corset,
  Cube,
  FlightHelmet,
  Fox,
  LightsPunctualLamp,
  MaterialsVariantsShoe,
  MosquitoInAmber,
  ReciprocatingSaw,
  RiggedFigure,
  SciFiHelmet,
  SheenChair,
  Sponza,
  Suzanne,
  DamagedHelmet,
  AntiqueCamera,
  BoomBox,
  Duck,
  DragonAttenuation,
  CesiumMilkTruck,
  WaterBottle,
  IridescenceLamp,
  IridescentDishWithOlives,
  GlamVelvetSofa,
  GearboxAssy,
  Lantern,
  Avocado,
  ToyCar,

  // test models
  AlphaBlendModeTest,
  AnimatedMorphCube,
  AnimatedMorphSphere,
  AnimatedTriangle,
  AttenuationTest,
  ClearCoatTest,
  EmissiveStrengthTest,
  EnvironmentTest,
  InteropolationTest,
  MorphPrimitivesTest,
  MorphStressTest,
  MultiUVTest,
  NormalTangentMirrorTest,
  NormalTangentTest,
  OrientationTest,
  RecursiveSkeletons,
  RiggedSimple,
  SheenCloth,
  SimpleMorph,
  SimpleSkin,
  SimpleSparseAccessor,
  BoxTextured,
  TextureEncodingTest,
  TextureCoordinateTest,
  SpecularTest,
  MetalRoughSpheresNoTexture,
  MetalRoughSpheres,
  BoxTexturedNonPowerOfTwo
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

export function getKhronosGlTFUrl(
  model: KhronosModel,
  format: GLTFFormat
): string {
  const modelName = KhronosModel[model];
  const formatFolder = glTFFormatToFolder[format];
  const extension = glTFFormatToExtension[format];
  return `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/${modelName}/${formatFolder}/${modelName}.${extension}`;
}
