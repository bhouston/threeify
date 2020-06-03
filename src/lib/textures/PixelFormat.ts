//
// OpenGL-compatible texture constants
//
// Authors:
// * @bhouston
//

const GL = WebGLRenderingContext;
const GL2 = WebGL2RenderingContext;

// from https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
export enum PixelFormat {
	RGBA = GL.RGBA,
	RGB = GL.RGB,
	LuminanceAlpha = GL.LUMINANCE_ALPHA,
	Luminance = GL.LUMINANCE,
	Alpha = GL.ALPHA,
	DepthComponent = GL2.DEPTH_COMPONENT,
	DepthStencil = GL2.DEPTH_STENCIL,
}

export function numPixelFormatComponents(pixelFormat: PixelFormat) {
	switch (pixelFormat) {
		case PixelFormat.RGBA:
			return 4;
		case PixelFormat.RGB:
			return 3;
		case PixelFormat.Alpha:
			return 1;
		case PixelFormat.Luminance:
			return 1;
		case PixelFormat.LuminanceAlpha:
			return 2;
		case PixelFormat.DepthComponent:
			return 1;
		case PixelFormat.DepthStencil:
			return 2;
	}
	throw new Error('unknown pixel format: ' + pixelFormat);
}
