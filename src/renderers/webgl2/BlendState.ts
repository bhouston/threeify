//
// OpenGL-compatible blend state
//
// Authors:
// * @bhouston
//

import { ICloneable, IEquatable } from "../../model/interfaces";
import { BlendMode } from "../../materials/BlendMode";

const GL = WebGLRenderingContext;

export enum BlendEquation {
  Add = GL.FUNC_ADD, // source + destination
  Substract = GL.FUNC_SUBTRACT, // source - destination
  ReverseSubtract = GL.FUNC_REVERSE_SUBTRACT, // destination - source
}

export enum BlendFunc {
  Zero = GL.ZERO, // Multiplies all colors by 0.
  One = GL.ONE, // Multiplies all colors by 1.
  SourceColor = GL.SRC_COLOR, // ultiplies all colors by the source colors.
  OneMinusSourceColor = GL.ONE_MINUS_SRC_COLOR, // 	Multiplies all colors by 1 minus each source color.
  DestColor = GL.DST_COLOR, // Multiplies all colors by the destination color.
  OneMinusDestColor = GL.ONE_MINUS_DST_COLOR, // Multiplies all colors by 1 minus each destination color.
  SourceAlpha = GL.SRC_ALPHA, // Multiplies all colors by the source alpha value.
  OneMinusSourceAlpha = GL.ONE_MINUS_SRC_ALPHA, // Multiplies all colors by 1 minus the source alpha value.
  DestAlpha = GL.DST_ALPHA, // Multiplies all colors by the destination alpha value.
  OneMinurDestAlpha = GL.ONE_MINUS_DST_ALPHA, // Multiplies all colors by 1 minus the destination alpha value.
  ConstantColor = GL.CONSTANT_COLOR, // Multiplies all colors by a constant color.
  OneMinusConstantColor = GL.ONE_MINUS_CONSTANT_COLOR, // Multiplies all colors by 1 minus a constant color.
  ConstantAlpha = GL.CONSTANT_ALPHA, // Multiplies all colors by a constant alpha value.
  OneMinusConstantAlpha = GL.ONE_MINUS_CONSTANT_ALPHA, // Multiplies all colors by 1 minus a constant alpha value.
  SourceAlphaSaturate = GL.SRC_ALPHA_SATURATE, // Multiplies the RGB colors by the smaller of either the source alpha value or the value of 1 minus the destination alpha value. The alpha value is multiplied by 1.
}

export class BlendState
  implements ICloneable<BlendState>, IEquatable<BlendState> {
  enabled: boolean;
  sourceRGBFactor: BlendFunc;
  destRGBFactor: BlendFunc;
  sourceAlphaFactor: BlendFunc;
  destAlphaFactor: BlendFunc;
  equation: BlendEquation;

  constructor(
    enabled: boolean = true,
    sourceRGBFactor: BlendFunc = BlendFunc.One,
    destRGBFactor: BlendFunc = BlendFunc.Zero,
    sourceAlphaFactor: BlendFunc = BlendFunc.One,
    destAlphaFactor: BlendFunc = BlendFunc.Zero,
    equation: BlendEquation = BlendEquation.Add
  ) {
    this.enabled = enabled;
    this.sourceRGBFactor = sourceRGBFactor;
    this.destRGBFactor = destRGBFactor;
    this.sourceAlphaFactor = sourceAlphaFactor;
    this.destAlphaFactor = destAlphaFactor;
    this.equation = equation;
  }

  clone() {
    return new BlendState(
      this.enabled,
      this.sourceRGBFactor,
      this.destRGBFactor,
      this.sourceAlphaFactor,
      this.destAlphaFactor,
      this.equation
    );
  }

  copy(bs: BlendState) {
    this.enabled = bs.enabled;
    this.sourceRGBFactor = bs.sourceRGBFactor;
    this.destRGBFactor = bs.destRGBFactor;
    this.sourceAlphaFactor = bs.sourceAlphaFactor;
    this.destAlphaFactor = bs.destAlphaFactor;
    this.equation = bs.equation;
  }

  equals(bs: BlendState) {
    return (
      this.enabled === bs.enabled &&
      this.sourceRGBFactor === bs.sourceRGBFactor &&
      this.destRGBFactor === bs.destRGBFactor &&
      this.sourceAlphaFactor === bs.sourceAlphaFactor &&
      this.destAlphaFactor === bs.destAlphaFactor &&
      this.equation === bs.equation
    );
  }
}

function blendModeToBlendState(blendMode: BlendMode, premultiplied: boolean) {
  if (premultiplied) {
    switch (blendMode) {
      case BlendMode.None:
        return new BlendState(false);
      case BlendMode.Over:
        return new BlendState(
          true,
          BlendFunc.One,
          BlendFunc.OneMinusSourceAlpha,
          BlendFunc.One,
          BlendFunc.OneMinusSourceAlpha
        );
      case BlendMode.Add:
        return new BlendState(
          true,
          BlendFunc.One,
          BlendFunc.One,
          BlendFunc.One,
          BlendFunc.One
        );
      case BlendMode.Subtract:
        return new BlendState(
          true,
          BlendFunc.Zero,
          BlendFunc.Zero,
          BlendFunc.OneMinusSourceColor,
          BlendFunc.OneMinusSourceAlpha
        );
      case BlendMode.Multiply:
        return new BlendState(
          true,
          BlendFunc.Zero,
          BlendFunc.SourceColor,
          BlendFunc.Zero,
          BlendFunc.SourceAlpha
        );
    }
  } else {
    switch (blendMode) {
      case BlendMode.None:
        return new BlendState(false);
      case BlendMode.Over:
        return new BlendState(
          true,
          BlendFunc.SourceAlpha,
          BlendFunc.OneMinusSourceAlpha,
          BlendFunc.One,
          BlendFunc.OneMinusSourceAlpha
        );
      case BlendMode.Add:
        return new BlendState(
          true,
          BlendFunc.SourceAlpha,
          BlendFunc.SourceAlpha,
          BlendFunc.One,
          BlendFunc.One
        );
      case BlendMode.Subtract:
        return new BlendState(
          true,
          BlendFunc.Zero,
          BlendFunc.Zero,
          BlendFunc.OneMinusSourceColor,
          BlendFunc.OneMinusSourceColor
        );
      case BlendMode.Multiply:
        return new BlendState(
          true,
          BlendFunc.Zero,
          BlendFunc.Zero,
          BlendFunc.SourceColor,
          BlendFunc.SourceColor
        );
    }
  }
}
