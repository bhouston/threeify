import { GL } from '../GL';

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
