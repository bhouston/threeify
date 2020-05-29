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
