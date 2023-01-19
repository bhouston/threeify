import { Vec2, Mat4, mat4OrthographicSimple } from "@threeify/core";
import { Camera } from "./Camera";

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
