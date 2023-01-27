import { Mat4, mat4PerspectiveFov } from '@threeify/core';

import { CameraNode, ICameraProps } from './CameraNode';

export interface IPerspectiveCameraProps extends ICameraProps {
  verticalFov?: number;
  far?: number;
}

export class PerspectiveCamera extends CameraNode {
  public verticalFov = Math.PI / 3;

  constructor(props: IPerspectiveCameraProps = {}) {
    super(props);
    this.verticalFov = props.verticalFov || this.verticalFov;
  }

  getProjection(result = new Mat4()): Mat4 {
    return mat4PerspectiveFov(
      this.verticalFov,
      this.near,
      this.far,
      this.zoom,
      this.pixelAspectRatio * this.viewAspectRatio,
      result
    );
  }
}
