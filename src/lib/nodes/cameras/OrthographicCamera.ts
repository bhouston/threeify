//
// based on OrthographicCamera from Three.js
//
// Authors:
// * @bhouston
//

import { Matrix4 } from '../../math/Matrix4';
import { makeMatrix4OrthographicSimple } from '../../math/Matrix4.Functions';
import { Vector2 } from '../../math/Vector2';
import { Camera } from './Camera';

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

  getProjection(viewAspectRatio = 1.0, result = new Matrix4()): Matrix4 {
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
