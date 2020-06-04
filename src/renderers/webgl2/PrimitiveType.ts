const GL = WebGLRenderingContext;

export enum PrimitiveType {
	Points = GL.POINTS,
	Lines = GL.LINES,
	LineStrip = GL.LINE_STRIP,
	Triangles = GL.TRIANGLES,
	TriangleFan = GL.TRIANGLE_FAN,
	TriangleStrip = GL.TRIANGLE_STRIP,
}
