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

  constructor(public near: number, public far: number) {
    super();
  }

  abstract getProjection(viewAspectRatio: number): Mat4;
}
