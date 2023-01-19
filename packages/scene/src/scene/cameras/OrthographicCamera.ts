//
// based on OrthographicCamera from Three.js
//
// Authors:
// * @bhouston
//

import { mat4OrthographicSimple } from '../../math/Mat4.Functions.js';
import { Mat4 } from '../../math/Mat4.js';
import { Vec2 } from '../../math/Vec2.js';
import { Camera } from './Camera.js';

export class OrthographicCamera extends Camera {
  constructor(
    public height: number,
    near: number,
    far: number,
    public center = new Vec2(),
    public zoom = 1
  ) {
    super(near, far);
  }

  getProjection(viewAspectRatio = 1, result = new Mat4()): Mat4 {
    return mat4OrthographicSimple(
      this.height,
      this.center,
      this.near,
      this.far,
      this.zoom,
      viewAspectRatio * this.pixelAspectRatio,
      result
    );
  }
}
