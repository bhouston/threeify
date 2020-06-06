//
// based on OrthographicCamera from Three.js
//
// Authors:
// * @bhouston
//

import { Camera } from "./Camera";
import { Matrix4 } from "../../math/Matrix4";
import { Vector2 } from "../../math/Vector2";

export class OrthographicCamera extends Camera {
  height: number;
  near: number;
  far: number;
  center: Vector2;
  zoom: number;

  constructor(height: number, near: number, far: number, center = new Vector2(0, 0), zoom = 1) {
    super();

    this.height = height;
    this.near = near;
    this.far = far;
    this.center = center;
    this.zoom = zoom;
  }

  getProjection(viewAspectRatio = 1.0): Matrix4 {
    const width = (this.height * viewAspectRatio * this.pixelAspectRatio) / this.zoom;

    const left = -width * 0.5 + this.center.x;
    const right = left + width;

    const top = -this.height * 0.5 + this.center.y;
    const bottom = top + this.height;

    return new Matrix4().makeOrthographicProjection(left, right, top, bottom, this.near, this.far);
  }
}
