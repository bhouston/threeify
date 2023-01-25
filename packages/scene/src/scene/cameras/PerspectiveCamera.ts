import { Mat4, mat4PerspectiveFov } from '@threeify/core';

import { Camera, ICameraProps } from './Camera';

export interface IPerspectiveCameraProps extends ICameraProps {
  verticalFov?: number;
  far?: number;
  pixelAspectRatio?: number;
}

export class PerspectiveCamera extends Camera {
  public verticalFov = Math.PI / 3;

  constructor(props: IPerspectiveCameraProps = {}) {
    super(props);
    this.verticalFov = props.verticalFov || this.verticalFov;
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
