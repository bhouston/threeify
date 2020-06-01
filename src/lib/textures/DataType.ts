//
// OpenGL-compatible texture constants
//
// Authors:
// * @bhouston
//

const GL = WebGLRenderingContext;
const GL2 = WebGL2RenderingContext;

// from https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
export enum DataType {
	Byte = GL2.BYTE,
	UnsignedByte = GL.UNSIGNED_BYTE,
	Short = GL2.SHORT,
	UnsignedShort = GL.UNSIGNED_SHORT,
	Int = GL2.INT,
	UnsignedInt = GL.UNSIGNED_INT,
	HalfFloat = GL2.HALF_FLOAT,
	Float = GL.FLOAT,
}
