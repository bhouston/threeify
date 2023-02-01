export enum ThreeJSModel {
  coffeemat,
  facecap,
  ferrari,
  Flamingo,
  Horse,
  kira,
  LittlestTokyo,
  Parrot,
  PrimaryIonDrive,
  ShadowmappableMesh,
  Soldier,
  Stork,
  Xbot
}

export function getThreejsGLTFUrl(model: ThreeJSModel): string {
  const modelName = ThreeJSModel[model];
  const extension = 'glb';
  return `https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/${modelName}.${extension}`;
}
