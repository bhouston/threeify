//
// OpenGL-compatible texture constants
//
// Authors:
// * @bhouston
//

import { GL } from '../GL';

export enum TextureWrap {
  MirroredRepeat = GL.MIRRORED_REPEAT,
  ClampToEdge = GL.CLAMP_TO_EDGE,
  Repeat = GL.REPEAT
}
