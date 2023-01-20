import { Mat4 } from '@threeify/core';
import { SceneNode } from '../SceneNode';

export abstract class Camera extends SceneNode {
  pixelAspectRatio = 1;

  constructor(public near: number, public far: number) {
    super();
  }

  abstract getProjection(viewAspectRatio: number): Mat4;
}
