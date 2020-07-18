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

type CubeMapFace = {
  index: number;
  name: string;
  target: TextureTarget;
  worldLook: Vector3;
  worldUp: Vector3;
  crossPosition: Vector2; // location within a cross that is 4x3: https://github.com/tmarrinan/cube2equirect
  uvIndices: Vector2; // the indices and sign of the uvs: https://www.khronos.org/opengl/wiki/File:CubeMapAxes.png
  uvSigns: Vector2; // the indices and sign of the uvs: https://www.khronos.org/opengl/wiki/File:CubeMapAxes.png
};

// names are from https://learnopengl.com/Advanced-OpenGL/Cubemaps

export const cubeMapFaces: Array<CubeMapFace> = [
  {
    index: 0,
    name: "right",
    target: TextureTarget.CubeMapPositiveX,
    worldLook: new Vector3(1, 0, 0),
    worldUp: new Vector3(0.0, -1.0, 0.0),
    crossPosition: new Vector2(2, 1),
    uvIndices: new Vector2(2, 1),
    uvSigns: new Vector2(-1, -1),
  },
  {
    index: 1,
    name: "left",
    target: TextureTarget.CubeMapNegativeX,
    worldLook: new Vector3(-1, 0, 0),
    worldUp: new Vector3(0.0, -1.0, 0.0),
    crossPosition: new Vector2(0, 1),
    uvIndices: new Vector2(2, 1),
    uvSigns: new Vector2(-1, -1),
  },
  {
    index: 2,
    name: "top",
    target: TextureTarget.CubeMapPositiveY,
    worldLook: new Vector3(0, 1, 0),
    worldUp: new Vector3(0.0, 0.0, 1.0),
    crossPosition: new Vector2(1, 0),
    uvIndices: new Vector2(0, 2),
    uvSigns: new Vector2(1, 1),
  },
  {
    index: 3,
    name: "bottom",
    target: TextureTarget.CubeMapNegativeY,
    worldLook: new Vector3(0, -1, 0),
    worldUp: new Vector3(0.0, 0.0, -1.0),
    crossPosition: new Vector2(1, 2),
    uvIndices: new Vector2(0, 2),
    uvSigns: new Vector2(1, -1),
  },
  {
    index: 4,
    name: "back",
    target: TextureTarget.CubeMapPositiveZ,
    worldLook: new Vector3(0, 0, 1),
    worldUp: new Vector3(0.0, -1.0, 0.0),
    crossPosition: new Vector2(3, 1),
    uvIndices: new Vector2(0, 1),
    uvSigns: new Vector2(1, -1),
  },
  {
    index: 5,
    name: "front",
    target: TextureTarget.CubeMapNegativeZ,
    worldLook: new Vector3(0, 0, -1),
    worldUp: new Vector3(0.0, -1.0, 0.0),
    crossPosition: new Vector2(1, 1),
    uvIndices: new Vector2(0, 1),
    uvSigns: new Vector2(-1, -1),
  },
];

export function makeMatrix4CubeMapTransform(position: Vector3, faceIndex: number, result = new Matrix4()): Matrix4 {
  return makeMatrix4LookAt(
    position,
    position.clone().add(cubeMapFaces[faceIndex].worldLook),
    cubeMapFaces[faceIndex].worldUp,
    result,
  );
}

/*
export function makeMatrix4CubeMapProjection(near: number, far: number, result = new Matrix4()): Matrix4 {
  const CUBE_PROJECTION = mat4.perspective(Math.PI / 2, aspect, near, far);
}
*/
