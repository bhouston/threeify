import { Mat4 } from '@threeify/core';

import { ISceneNodeProps, SceneNode } from '../SceneNode';

export interface ICameraProps extends ISceneNodeProps {
  near?: number;
  far?: number;
  pixelAspectRatio?: number;
  zoom?: number;
}

export abstract class CameraNode extends SceneNode {
  public pixelAspectRatio = 1;
  public near = 0.1;
  public far = 1000;
  public zoom = 1;
  constructor(props: ICameraProps = {}) {
    super(props);
    this.pixelAspectRatio = props.pixelAspectRatio || this.pixelAspectRatio;
    this.near = props.near || this.near;
    this.far = props.far || this.far;
    this.zoom = props.zoom || this.zoom;
  }

  abstract getProjection(viewAspectRatio: number): Mat4;
}
