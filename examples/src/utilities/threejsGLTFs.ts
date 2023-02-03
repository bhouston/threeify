export enum ThreeJSGLTF {
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

export function getThreeJSGLTFUrl(gltf: ThreeJSGLTF): string {
  const gltfName = ThreeJSGLTF[gltf];
  const extension = 'glb';
  return `https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/${gltfName}.${extension}`;
}
