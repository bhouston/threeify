//
// OpenGL-compatible texture constants
//
// Authors:
// * @bhouston
//

const GL = WebGLRenderingContext;

export enum TextureWrap {
    MirroredRepeat = GL.MIRRORED_REPEAT,
    ClampToEdge = GL.CLAMP_TO_EDGE,
    Repeat = GL.REPEAT,
}