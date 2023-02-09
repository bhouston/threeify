import { Mat4 } from '@threeify/math';

import { ISceneNodeProps, SceneNode } from '../SceneNode';

export interface ICameraProps extends ISceneNodeProps {
  near?: number;
  far?: number;
  pixelAspectRatio?: number;
  viewAspectRatio?: number;
  zoom?: number;
}

export abstract class CameraNode extends SceneNode {
  public pixelAspectRatio = 1;
  public near = 0.1;
  public far = 1000;
  public zoom = 1;
  public viewAspectRatio = 1;

  constructor(props: ICameraProps = {}) {
    super(props);
    this.pixelAspectRatio =
      props.pixelAspectRatio !== undefined
        ? props.pixelAspectRatio
        : this.pixelAspectRatio;
    this.near = props.near !== undefined ? props.near : this.near;
    this.far = props.far !== undefined ? props.far : this.far;
    this.zoom = props.zoom !== undefined ? props.zoom : this.zoom;
    this.viewAspectRatio =
      props.viewAspectRatio !== undefined
        ? props.viewAspectRatio
        : this.viewAspectRatio;
  }

  abstract getProjection(): Mat4;
}
