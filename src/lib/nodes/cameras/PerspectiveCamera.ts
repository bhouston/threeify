//
// based on PerspectiveCamera from Three.js
//
// Authors:
// * @bhouston
//

import { makeMat4PerspectiveFov } from '../../math/Mat4.Functions.js';
import { Mat4 } from '../../math/Mat4.js';
import { Camera } from './Camera.js';

export class PerspectiveCamera extends Camera {
  constructor(
    public verticalFov: number,
    public near: number,
    public far: number,
    public zoom = 1
  ) {
    super();
  }

  getProjection(viewAspectRatio = 1, result = new Mat4()): Mat4 {
    return makeMat4PerspectiveFov(
      this.verticalFov,
      this.near,
      this.far,
      this.zoom,
      this.pixelAspectRatio * viewAspectRatio,
      result
    );
  }
}
