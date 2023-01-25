import { Mat4, mat4OrthographicSimple, Vec2 } from '@threeify/core';

import { Camera, ICameraProps } from './Camera';

export interface IOrthographicCameraProps extends ICameraProps {
  height?: number;
  center?: Vec2;
}

export class OrthographicCamera extends Camera {
  public height = 1;
  public center = new Vec2(0, 0);

  constructor(props: IOrthographicCameraProps = {}) {
    super(props);
    this.height = props.height || this.height;
    if (props.center !== undefined) this.center.copy(props.center);
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
