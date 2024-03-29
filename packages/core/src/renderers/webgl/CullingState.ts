//
// OpenGL-compatible culling state
//
// Authors:
// * @bhouston
//

import { ICloneable, IEquatable } from '../../core/types.js';
import { GL } from './GL.js';

// set: void gl.frontFace(mode);
export enum WindingOrder {
  Clockwise = GL.CW,
  CounterClockwise = GL.CCW // default
}

// set: void gl.cullFace(mode);
export enum CullingSide {
  Front = GL.FRONT,
  Back = GL.BACK, // default
  FrontBack = GL.FRONT_AND_BACK
}

export class CullingState
  implements ICloneable<CullingState>, IEquatable<CullingState>
{
  static readonly None = new CullingState(false);
  static readonly Front = new CullingState(true, CullingSide.Front);
  static readonly Back = new CullingState(true, CullingSide.Back);

  // TODO: Should be initialized to default WebGL states
  constructor(
    public enabled = true,
    public sides = CullingSide.Back,
    public windingOrder = WindingOrder.CounterClockwise
  ) {}

  clone(): CullingState {
    return new CullingState(this.enabled, this.sides, this.windingOrder);
  }

  copy(cs: CullingState): void {
    this.enabled = cs.enabled;
    this.sides = cs.sides;
    this.windingOrder = cs.windingOrder;
  }

  equals(cs: CullingState): boolean {
    return (
      this.enabled === cs.enabled &&
      this.sides === cs.sides &&
      this.windingOrder === cs.windingOrder
    );
  }
}
