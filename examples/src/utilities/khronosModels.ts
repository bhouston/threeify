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
  BoxTexturedNonPowerOfTwo,
  TransmissionTest,
  TransmissionRoughnessTest
}

export enum GltfFormat {
  glTF,
  glTFBinary,
  glTFDraco,
  glTFEmbedded
}

const glTFFormatToFolder = {
  [GltfFormat.glTF]: 'glTF',
  [GltfFormat.glTFBinary]: 'glTF-Binary',
  [GltfFormat.glTFDraco]: 'glTF-Draco',
  [GltfFormat.glTFEmbedded]: 'glTF-Embedded'
};

const glTFFormatToExtension = {
  [GltfFormat.glTF]: 'gltf',
  [GltfFormat.glTFBinary]: 'glb',
  [GltfFormat.glTFDraco]: 'gltf',
  [GltfFormat.glTFEmbedded]: 'gltf'
};

export function getKhronosGltfUrl(
  model: KhronosModel,
  format: GltfFormat
): string {
  const modelName = KhronosModel[model];
  const formatFolder = glTFFormatToFolder[format];
  const extension = glTFFormatToExtension[format];
  const rootPath =
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0';
  //const rootPath = '/assets/glTF-Sample-Models/2.0';
  return `${rootPath}/${modelName}/${formatFolder}/${modelName}.${extension}`;
}
