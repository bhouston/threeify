//
// OpenGL-compatible depth test state
//
// Authors:
// * @bhouston
//

import { ICloneable, IEquatable } from '../../core/types.js';
import { GL } from './GL.js';

export enum DepthTestFunc {
  /**
   * never pass
   */
  Never = GL.NEVER,
  /**
   * pass if the incoming value is less than the depth buffer value
   */
  Less = GL.LESS,
  /**
   * pass if the incoming value equals the depth buffer value
   */
  Equal = GL.EQUAL,
  /**
   * pass if the incoming value is less than or equal to the depth buffer value
   */
  LessOrEqual = GL.LEQUAL,
  /**
   * pass if the incoming value is greater than the depth buffer value
   */
  Greater = GL.GREATER,
  /**
   * Pass if the incoming value is not equal to the depth buffer value
   */
  NotEqual = GL.NOTEQUAL,
  /**
   * Pass if the incoming value is greater than or equal to the depth buffer
   * value
   */
  GreaterOrEqual = GL.GEQUAL,
  /**
   * Always pass.
   */
  Always = GL.ALWAYS
}

export class DepthTestState
  implements ICloneable<DepthTestState>, IEquatable<DepthTestState>
{
  static readonly Less = new DepthTestState(true, DepthTestFunc.Less, true);
  static readonly LessOrEqual = new DepthTestState(
    true,
    DepthTestFunc.LessOrEqual,
    true
  );
  static readonly None = new DepthTestState(false);

  // TODO: Should be intialized to default WebGL states
  constructor(
    public enabled = true,
    public func = DepthTestFunc.Less,
    public write = true
  ) {}

  clone(): DepthTestState {
    return new DepthTestState(this.enabled, this.func, this.write);
  }

  copy(dts: DepthTestState): void {
    this.enabled = dts.enabled;
    this.func = dts.func;
    this.write = dts.write;
  }

  equals(dts: DepthTestState): boolean {
    return (
      this.enabled === dts.enabled &&
      this.func === dts.func &&
      this.write === dts.write
    );
  }
}
