//
// OpenGL-compatible blend state
//
// Authors:
// * @bhouston
//

import { ICloneable, IEquatable } from '../../core/types.js';
import { Blending } from '../../materials/Blending.js';
import { GL } from './GL.js';

export enum BlendEquation {
  /**
   * source + destination
   */
  Add = GL.FUNC_ADD,
  /**
   * source - destination
   */
  Subtract = GL.FUNC_SUBTRACT,
  /**
   * destination - source
   */
  ReverseSubtract = GL.FUNC_REVERSE_SUBTRACT
}

export enum BlendFunc {
  /**
   * Multiplies all colors by 0.
   */
  Zero = GL.ZERO,
  /**
   * Multiplies all colors by 1.
   */
  One = GL.ONE,
  /**
   * Multiplies all colors by the source colors.
   */
  SourceColor = GL.SRC_COLOR,
  /**
   * Multiplies all colors by 1 minus each source color.
   */
  OneMinusSourceColor = GL.ONE_MINUS_SRC_COLOR,
  /**
   * Multiplies all colors by the destination color.
   */
  DestColor = GL.DST_COLOR,
  /**
   * Multiplies all colors by 1 minus each destination color.
   */
  OneMinusDestColor = GL.ONE_MINUS_DST_COLOR,
  /**
   * Multiplies all colors by the source alpha value.
   */
  SourceAlpha = GL.SRC_ALPHA,
  /**
   * Multiplies all colors by 1 minus the source alpha value.
   */
  OneMinusSourceAlpha = GL.ONE_MINUS_SRC_ALPHA,
  /**
   * Multiplies all colors by the destination alpha value.
   */
  DestAlpha = GL.DST_ALPHA,
  /**
   * Multiplies all colors by 1 minus the destination alpha value.
   */
  OneMinusDestAlpha = GL.ONE_MINUS_DST_ALPHA,
  /**
   * Multiplies all colors by a constant color.
   */
  ConstantColor = GL.CONSTANT_COLOR,
  /**
   * Multiplies all colors by 1 minus a constant color.
   */
  OneMinusConstantColor = GL.ONE_MINUS_CONSTANT_COLOR,
  /**
   * Multiplies all colors by a constant alpha value.
   */
  ConstantAlpha = GL.CONSTANT_ALPHA,
  /**
   * Multiplies all colors by 1 minus a constant alpha value.
   */
  OneMinusConstantAlpha = GL.ONE_MINUS_CONSTANT_ALPHA,
  /**
   * Multiplies the RGB colors by the smaller of either the source alpha value
   * or the value of 1 minus the destination alpha value. The alpha value is
   * multiplied by 1.
   */
  SourceAlphaSaturate = GL.SRC_ALPHA_SATURATE
}

export class BlendState
  implements ICloneable<BlendState>, IEquatable<BlendState>
{
  static readonly None = new BlendState();

  // TODO: Should be initialized to default WebGL states
  constructor(
    public sourceRGBFactor = BlendFunc.One,
    public destRGBFactor = BlendFunc.Zero,
    public sourceAlphaFactor = BlendFunc.One,
    public destAlphaFactor = BlendFunc.Zero,
    public equation = BlendEquation.Add
  ) {}

  clone(): BlendState {
    return new BlendState(
      this.sourceRGBFactor,
      this.destRGBFactor,
      this.sourceAlphaFactor,
      this.destAlphaFactor,
      this.equation
    );
  }

  copy(bs: BlendState): void {
    this.sourceRGBFactor = bs.sourceRGBFactor;
    this.destRGBFactor = bs.destRGBFactor;
    this.sourceAlphaFactor = bs.sourceAlphaFactor;
    this.destAlphaFactor = bs.destAlphaFactor;
    this.equation = bs.equation;
  }

  equals(bs: BlendState): boolean {
    return (
      this.sourceRGBFactor === bs.sourceRGBFactor &&
      this.destRGBFactor === bs.destRGBFactor &&
      this.sourceAlphaFactor === bs.sourceAlphaFactor &&
      this.destAlphaFactor === bs.destAlphaFactor &&
      this.equation === bs.equation
    );
  }
}

export function blendModeToBlendState(
  blending: Blending,
  premultiplied = true
): BlendState {
  if (premultiplied) {
    switch (blending) {
      case Blending.Over:
        return new BlendState(
          BlendFunc.One,
          BlendFunc.OneMinusSourceAlpha,
          BlendFunc.One,
          BlendFunc.OneMinusSourceAlpha
        );
      case Blending.Add:
        return new BlendState(
          BlendFunc.One,
          BlendFunc.One,
          BlendFunc.One,
          BlendFunc.One
        );
      case Blending.Subtract:
        return new BlendState(
          BlendFunc.Zero,
          BlendFunc.OneMinusSourceAlpha,
          BlendFunc.Zero,
          BlendFunc.OneMinusSourceAlpha
        );
      case Blending.Multiply:
        return new BlendState(
          BlendFunc.Zero,
          BlendFunc.SourceColor,
          BlendFunc.Zero,
          BlendFunc.SourceAlpha
        );
    }
  } else {
    switch (blending) {
      case Blending.Over:
        return new BlendState(
          BlendFunc.SourceAlpha,
          BlendFunc.OneMinusSourceAlpha,
          BlendFunc.One,
          BlendFunc.OneMinusSourceAlpha
        );
      case Blending.Add:
        return new BlendState(
          BlendFunc.SourceAlpha,
          BlendFunc.One,
          BlendFunc.One,
          BlendFunc.One
        );
      case Blending.Subtract:
        return new BlendState(
          BlendFunc.Zero,
          BlendFunc.OneMinusSourceAlpha, // alpha only, as rgb + alpha can not be replicated across pre/post multiplied alpha.
          BlendFunc.Zero,
          BlendFunc.OneMinusSourceAlpha
        );
      case Blending.Multiply:
        return new BlendState(
          BlendFunc.Zero,
          BlendFunc.SourceColor,
          BlendFunc.Zero,
          BlendFunc.SourceColor
        );
    }
  }
}
