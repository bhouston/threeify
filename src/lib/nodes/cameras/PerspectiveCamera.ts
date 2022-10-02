//
// based on PerspectiveCamera from Three.js
//
// Authors:
// * @bhouston
//

import { Matrix4 } from '../../math/Matrix4';
import { makeMatrix4PerspectiveFov } from '../../math/Matrix4.Functions';
import { Camera } from './Camera';

export class PerspectiveCamera extends Camera {
  constructor(
    public verticalFov: number,
    public near: number,
    public far: number,
    public zoom = 1.0
  ) {
    super();
  }

  getProjection(viewAspectRatio = 1.0, result = new Matrix4()): Matrix4 {
    return makeMatrix4PerspectiveFov(
      this.verticalFov,
      this.near,
      this.far,
      this.zoom,
      this.pixelAspectRatio * viewAspectRatio,
      result
    );
  }
}
