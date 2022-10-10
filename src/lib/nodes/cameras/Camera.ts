//
// based on Camera from Three.js
//
// Authors:
// * @bhouston
//

import { Matrix4 } from '../../math/Matrix4.js';
import { Node } from '../Node.js';

export abstract class Camera extends Node {
  pixelAspectRatio = 1;

  abstract getProjection(viewAspectRatio: number): Matrix4;
}
