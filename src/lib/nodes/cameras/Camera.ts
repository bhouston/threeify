//
// based on Camera from Three.js
//
// Authors:
// * @bhouston
//

import { Matrix4 } from '../../math/Matrix4';
import { Node } from '../Node';

export abstract class Camera extends Node {
  pixelAspectRatio = 1.0;

  abstract getProjection(viewAspectRatio: number): Matrix4;
}
