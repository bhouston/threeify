import { Mat4, mat4PerspectiveFov } from '@threeify/math';

import { CameraNode, ICameraProps } from './CameraNode.js';

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

  getViewToClipProjection(result = new Mat4()): Mat4 {
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
