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

export function numPixelFormatComponents(pixelFormat: PixelFormat): number {
  switch (pixelFormat) {
    case PixelFormat.Alpha:
    case PixelFormat.Luminance:
    case PixelFormat.DepthComponent:
      return 1;
    case PixelFormat.LuminanceAlpha:
    case PixelFormat.DepthStencil:
      return 2;
    case PixelFormat.RGB:
      return 3;
    case PixelFormat.RGBA:
      return 4;
  }
  throw new Error(`unsupported pixel format: ${pixelFormat}`);
}
