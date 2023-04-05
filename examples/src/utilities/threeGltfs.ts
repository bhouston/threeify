export enum ThreeJsGltf {
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

export function getThreeJsGltfUrl(gltf: ThreeJsGltf): string {
  const gltfName = ThreeJsGltf[gltf];
  const extension = 'glb';
  return `https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/${gltfName}.${extension}`;
}
