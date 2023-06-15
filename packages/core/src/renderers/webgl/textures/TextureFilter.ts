//
// OpenGL-compatible texture constants
//
// Authors:
// * @bhouston
//

import { GL } from '../GL';

export enum TextureFilter {
  LinearMipmapLinear = GL.LINEAR_MIPMAP_LINEAR,
  LinearMipmapNearest = GL.LINEAR_MIPMAP_NEAREST,
  Linear = GL.LINEAR,
  Nearest = GL.NEAREST,
  NearestMipmapLinear = GL.NEAREST_MIPMAP_LINEAR,
  NearestMipmapNearest = GL.NEAREST_MIPMAP_NEAREST
}
