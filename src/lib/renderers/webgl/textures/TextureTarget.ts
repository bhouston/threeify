import { Vector3 } from "../../../math/Vector3";
import { GL } from "../GL";

export enum TextureTarget {
  Texture2D = GL.TEXTURE_2D,
  TextureCubeMap = GL.TEXTURE_CUBE_MAP,
  CubeMapPositiveX = GL.TEXTURE_CUBE_MAP_POSITIVE_X, // lowest number and the start if you want to offset
  CubeMapNegativeX = GL.TEXTURE_CUBE_MAP_NEGATIVE_X,
  CubeMapPositiveY = GL.TEXTURE_CUBE_MAP_POSITIVE_Y,
  CubeMapNegativeY = GL.TEXTURE_CUBE_MAP_NEGATIVE_Y,
  CubeMapPositiveZ = GL.TEXTURE_CUBE_MAP_POSITIVE_Z,
  CubeMapNegativeZ = GL.TEXTURE_CUBE_MAP_NEGATIVE_Z,
}

type CubeMapFace = { target: TextureTarget; direction: Vector3 };
export const cubeMapFaces: Array<CubeMapFace> = [
  { target: TextureTarget.CubeMapPositiveX, direction: new Vector3(1, 0, 0) },
  { target: TextureTarget.CubeMapNegativeX, direction: new Vector3(-1, 0, 0) },
  { target: TextureTarget.CubeMapPositiveY, direction: new Vector3(0, 1, 0) },
  { target: TextureTarget.CubeMapNegativeY, direction: new Vector3(0, -1, 0) },
  { target: TextureTarget.CubeMapPositiveZ, direction: new Vector3(0, 0, 1) },
  { target: TextureTarget.CubeMapNegativeZ, direction: new Vector3(0, 0, -1) },
];
