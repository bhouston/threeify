//
// based on Camera from Three.js
//
// Authors:
// * @bhouston
//

import { Mat4 } from '../../math/Mat4.js';
import { Node } from '../Node.js';

export abstract class Camera extends Node {
  pixelAspectRatio = 1;

  abstract getProjection(viewAspectRatio: number): Mat4;
}
