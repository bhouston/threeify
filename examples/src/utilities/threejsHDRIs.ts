export enum ThreeJSHRDI {
  blouberg_sunrise_2_1k,
  moonless_golf_1k,
  pedestrian_overpass_1k,
  quarry_01_1k,
  royal_esplanade_1k,
  san_giuseppe_bridge_2k,
  spot1Lux,
  venice_sunset_1k
}

//    https://github.com/mrdoob/three.js/blob/14663f58916d66d5bfe6b0d6dfbe5aa701c80408/examples/textures/equirectangular/moonless_golf_1k.hdr

export function getThreeJSHDRIUrl(image: ThreeJSHRDI): string {
  const imageName = ThreeJSHRDI[image];
  //const rootPath = `https://raw.githubusercontent.com/mrdoob/three.js/master`;
  const rootPath = '/assets/three.js';
  return `${rootPath}/examples/textures/equirectangular/${imageName}.hdr`;
}
