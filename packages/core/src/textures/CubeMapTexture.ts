//
// point light initially based on PointLight from Three.js
//
// Authors:
// * @bhouston
//

import { Mat4, mat4LookAt, Vec2, Vec3, vec3Add } from '@threeify/math';

import { DataType } from '../renderers/webgl/textures/DataType';
import { InternalFormat } from '../renderers/webgl/textures/InternalFormat';
import { TextureFilter } from '../renderers/webgl/textures/TextureFilter';
import { TextureTarget } from '../renderers/webgl/textures/TextureTarget';
import { fetchCubeMapImages } from './loaders/Image';
import { TextureSource, VirtualTexture } from './VirtualTexture';

export class CubeMapTexture extends VirtualTexture {
  constructor(
    public images: TextureSource[],
    level = 0,
    magFilter = TextureFilter.Linear,
    minFilter = TextureFilter.LinearMipmapLinear,
    internalFormat = InternalFormat.RGBA8,
    dataType = DataType.UnsignedByte,
    generateMipmaps = true,
    anisotropicLevels = 1
  ) {
    super(
      level,
      magFilter,
      minFilter,
      internalFormat,
      dataType,
      generateMipmaps,
      anisotropicLevels
    );

    if (this.images.length % 6 !== 0 || this.images.length === 0) {
      throw new Error(
        `images.length (${this.images.length}) must be a positive multiple of 6`
      );
    }
    const firstImage = images[0];
    // check if firstImage is a Vec2 in typescript
    if (firstImage instanceof Vec2) {
      this.size.copy(firstImage);
    } else {
      this.size = new Vec2(firstImage.width, firstImage.height);
    }
  }
}

export const cubeFaceNames = [
  'right',
  'left',
  'top',
  'bottom',
  'back',
  'front'
];

export const cubeFaceTargets = [
  TextureTarget.CubeMapPositiveX,
  TextureTarget.CubeMapNegativeX,
  TextureTarget.CubeMapPositiveY,
  TextureTarget.CubeMapNegativeY,
  TextureTarget.CubeMapPositiveZ,
  TextureTarget.CubeMapNegativeZ
];

export const cubeFaceLooks = [
  new Vec3(1, 0, 0),
  new Vec3(-1, 0, 0),
  new Vec3(0, 1, 0),
  new Vec3(0, -1, 0),
  new Vec3(0, 0, 1),
  new Vec3(0, 0, -1)
];

export const cubeFaceUps = [
  new Vec3(0, -1, 0),
  new Vec3(0, -1, 0),
  new Vec3(0, 0, 1),
  new Vec3(0, 0, -1),
  new Vec3(0, 1, 0),
  new Vec3(0, -1, 0)
];

export function makeMat4CubeMapTransform(
  position: Vec3,
  faceIndex: number,
  result = new Mat4()
): Mat4 {
  return mat4LookAt(
    position,
    vec3Add(position, cubeFaceLooks[faceIndex]),
    cubeFaceUps[faceIndex],
    result
  );
}

/*
export function makeMat4CubeMapProjection(near: number, far: number, result = new Mat4()): Mat4 {
  const CUBE_PROJECTION = mat4.perspective(Math.PI / 2, aspect, near, far);
}
*/

export async function fetchCubeMapTexture(
  urlPattern: string
): Promise<CubeMapTexture> {
  return new CubeMapTexture(await fetchCubeMapImages(urlPattern));
}
