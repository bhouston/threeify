//
// OpenGL-compatible texture constants
//
// Authors:
// * @bhouston
//

const GL = WebGLRenderingContext;
const GL2 = WebGL2RenderingContext;

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

export class Blend {
	enabled: boolean = true;
	equation: BlendEquation = BlendEquation.Add;
	sourceFactor: BlendFunc = BlendFunc.One;
	destFactor: BlendFunc = BlendFunc.Zero;
}
