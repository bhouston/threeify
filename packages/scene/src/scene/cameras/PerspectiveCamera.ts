//
// based on PerspectiveCamera from Three.js
//
// Authors:
// * @bhouston
//

import { mat4PerspectiveFov } from '../../math/Mat4.Functions.js';
import { Mat4 } from '../../math/Mat4.js';
import { Camera } from './Camera.js';

export class PerspectiveCamera extends Camera {
  constructor(
    public verticalFov: number,
    near: number,
    far: number,
    public zoom = 1
  ) {
    super(near, far);
  }

  getProjection(viewAspectRatio = 1, result = new Mat4()): Mat4 {
    return mat4PerspectiveFov(
      this.verticalFov,
      this.near,
      this.far,
      this.zoom,
      this.pixelAspectRatio * viewAspectRatio,
      result
    );
  }
}
