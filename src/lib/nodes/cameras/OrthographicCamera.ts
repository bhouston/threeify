//
// based on OrthographicCamera from Three.js
//
// Authors:
// * @bhouston
//

import { Matrix4 } from "../../math/Matrix4";
import { Vector2 } from "../../math/Vector2";
import { Camera } from "./Camera";

export class OrthographicCamera extends Camera {
  constructor(
    public height: number,
    public near: number,
    public far: number,
    public center = new Vector2(),
    public zoom = 1,
  ) {
    super();
  }

  getProjection(viewAspectRatio = 1.0): Matrix4 {
    const width = (this.height * viewAspectRatio * this.pixelAspectRatio) / this.zoom;

    const left = -width * 0.5 + this.center.x;
    const right = left + width;

    const top = -this.height * 0.5 + this.center.y;
    const bottom = top + this.height;

    return new Matrix4().makeOrthographic(left, right, top, bottom, this.near, this.far);
  }
}
