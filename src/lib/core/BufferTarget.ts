let GL = WebGLRenderingContext;

export enum BufferTarget {
	Array = GL.ARRAY_BUFFER, // Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.
	ElementArray = GL.ARRAY_BUFFER, // Buffer used for element indices.
	CopyRead = GL.COPY_READ_BUFFER, // Buffer for copying from one buffer object to another.
	CopyWrite = GL.COPY_WRITE_BUFFER, // Buffer for copying from one buffer object to another.
	TransformFeedback = GL.TRANSFORM_FEEDBACK_BUFFER, // Buffer for transform feedback operations.
	Uniform = GL.UNIFORM_BUFFER, // Buffer used for storing uniform blocks.
	PixelPack = GL.PIXEL_PACK_BUFFER, // Buffer used for pixel transfer operations.
	PixelUnpack = GL.PIXEL_UNPACK_BUFFER, // Buffer used for pixel transfer operations.
}
