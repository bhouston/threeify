import { Mat4, mat4PerspectiveFov } from "@threeify/core";
import { Camera } from "./Camera";

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
