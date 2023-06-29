//
// OpenGL-compatible texture constants
//
// Authors:
// * @bhouston
//

import { GL } from '../GL.js';

// from https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
export enum PixelFormat {
  R = GL.RED,
  RG = GL.RG,
  RGBA = GL.RGBA,
  RGB = GL.RGB,
  LuminanceAlpha = GL.LUMINANCE_ALPHA,
  Luminance = GL.LUMINANCE,
  Alpha = GL.ALPHA,
  DepthComponent = GL.DEPTH_COMPONENT,
  DepthComponent24 = GL.DEPTH_COMPONENT24,
  DepthStencil = GL.DEPTH_STENCIL
}

export function numPixelFormatComponents(pixelFormat: PixelFormat): number {
  switch (pixelFormat) {
    case PixelFormat.Alpha:
    case PixelFormat.Luminance:
    case PixelFormat.DepthComponent:
    case PixelFormat.DepthComponent24:
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
