//
// based on OrthographicCamera from Three.js
//
// Authors:
// * @bhouston
//

import { makeMatrix4OrthographicSimple } from '../../math/Matrix4.Functions.js';
import { Matrix4 } from '../../math/Matrix4.js';
import { Vector2 } from '../../math/Vector2.js';
import { Camera } from './Camera.js';

export class OrthographicCamera extends Camera {
  constructor(
    public height: number,
    public near: number,
    public far: number,
    public center = new Vector2(),
    public zoom = 1
  ) {
    super();
  }

  getProjection(viewAspectRatio = 1, result = new Matrix4()): Matrix4 {
    return makeMatrix4OrthographicSimple(
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
