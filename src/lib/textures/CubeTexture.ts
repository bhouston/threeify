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
    if (this.images.length !== 6) {
      throw new Error("images must be of length 6");
    }
    this.size = new Vector2(images[0].width, images[0].height);
  }
}

type CubeMapFace = { target: TextureTarget; lookDirection: Vector3; upDirection: Vector3 };
export const cubeMapFaces: Array<CubeMapFace> = [
  {
    target: TextureTarget.CubeMapPositiveX,
    lookDirection: new Vector3(1, 0, 0),
    upDirection: new Vector3(0.0, -1.0, 0.0),
  },
  {
    target: TextureTarget.CubeMapNegativeX,
    lookDirection: new Vector3(-1, 0, 0),
    upDirection: new Vector3(0.0, -1.0, 0.0),
  },
  {
    target: TextureTarget.CubeMapPositiveY,
    lookDirection: new Vector3(0, 1, 0),
    upDirection: new Vector3(0.0, 0.0, 1.0),
  },
  {
    target: TextureTarget.CubeMapNegativeY,
    lookDirection: new Vector3(0, -1, 0),
    upDirection: new Vector3(0.0, 0.0, -1.0),
  },
  {
    target: TextureTarget.CubeMapPositiveZ,
    lookDirection: new Vector3(0, 0, 1),
    upDirection: new Vector3(0.0, -1.0, 0.0),
  },
  {
    target: TextureTarget.CubeMapNegativeZ,
    lookDirection: new Vector3(0, 0, -1),
    upDirection: new Vector3(0.0, -1.0, 0.0),
  },
];

export function makeMatrix4CubeMapTransform(position: Vector3, faceIndex: number, result = new Matrix4()): Matrix4 {
  return makeMatrix4LookAt(
    position,
    position.clone().add(cubeMapFaces[faceIndex].lookDirection),
    cubeMapFaces[faceIndex].upDirection,
    result,
  );
}

/*
export function makeMatrix4CubeMapProjection(near: number, far: number, result = new Matrix4()): Matrix4 {
  const CUBE_PROJECTION = mat4.perspective(Math.PI / 2, aspect, near, far);
}
*/
