//
// point light initially based on PointLight from Three.js
//
// Authors:
// * @bhouston
//

import { Matrix4 } from "../math/Matrix4";
import { makeMatrix4LookAt } from "../math/Matrix4.Functions";
import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";
import { IPoolUser } from "../renderers/Pool";
import { DataType } from "../renderers/webgl/textures/DataType";
import { PixelFormat } from "../renderers/webgl/textures/PixelFormat";
import { TextureFilter } from "../renderers/webgl/textures/TextureFilter";
import { TextureTarget } from "../renderers/webgl/textures/TextureTarget";
import { TextureSource, VirtualTexture } from "./VirtualTexture";

export class CubeMapTexture extends VirtualTexture implements IPoolUser {
  constructor(
    public images: TextureSource[],
    level = 0,
    magFilter = TextureFilter.Linear,
    minFilter = TextureFilter.LinearMipmapLinear,
    pixelFormat = PixelFormat.RGBA,
    dataType = DataType.UnsignedByte,
    generateMipmaps = true,
    anisotropicLevels = 1,
  ) {
    super(level, magFilter, minFilter, pixelFormat, dataType, generateMipmaps, anisotropicLevels);
    if (this.images.length % 6 !== 0 || this.images.length === 0) {
      throw new Error(`images.length (${this.images.length}) must be a positive multiple of 6`);
    }
    this.size = new Vector2(images[0].width, images[0].height);
  }
}

export const cubeFaceNames = ["right", "left", "top", "bottom", "back", "front"];

export const cubeFaceTargets = [
  TextureTarget.CubeMapPositiveX,
  TextureTarget.CubeMapNegativeX,
  TextureTarget.CubeMapPositiveY,
  TextureTarget.CubeMapNegativeY,
  TextureTarget.CubeMapPositiveZ,
  TextureTarget.CubeMapNegativeZ,
];

export const cubeFaceLooks = [
  new Vector3(1, 0, 0),
  new Vector3(-1, 0, 0),
  new Vector3(0, 1, 0),
  new Vector3(0, -1, 0),
  new Vector3(0, 0, 1),
  new Vector3(0, 0, -1),
];

export const cubeFaceUps = [
  new Vector3(0, -1, 0),
  new Vector3(0, -1, 0),
  new Vector3(0, 0, 1),
  new Vector3(0, 0, -1),
  new Vector3(0, 1, 0),
  new Vector3(0, -1, 0),
];

export function makeMatrix4CubeMapTransform(position: Vector3, faceIndex: number, result = new Matrix4()): Matrix4 {
  return makeMatrix4LookAt(position, position.clone().add(cubeFaceLooks[faceIndex]), cubeFaceUps[faceIndex], result);
}

/*
export function makeMatrix4CubeMapProjection(near: number, far: number, result = new Matrix4()): Matrix4 {
  const CUBE_PROJECTION = mat4.perspective(Math.PI / 2, aspect, near, far);
}
*/
