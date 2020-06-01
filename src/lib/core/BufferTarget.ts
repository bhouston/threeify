export enum BufferTarget {
	Array = WebGLRenderingContext.ARRAY_BUFFER, // Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.
	ElementArray = WebGLRenderingContext.ARRAY_BUFFER, // Buffer used for element indices.
	CopyRead = WebGL2RenderingContext.COPY_READ_BUFFER, // Buffer for copying from one buffer object to another.
	CopyWrite = WebGL2RenderingContext.COPY_WRITE_BUFFER, // Buffer for copying from one buffer object to another.
	TransformFeedback = WebGL2RenderingContext.TRANSFORM_FEEDBACK_BUFFER, // Buffer for transform feedback operations.
	Uniform = WebGL2RenderingContext.UNIFORM_BUFFER, // Buffer used for storing uniform blocks.
	PixelPack = WebGL2RenderingContext.PIXEL_PACK_BUFFER, // Buffer used for pixel transfer operations.
	PixelUnpack = WebGL2RenderingContext.PIXEL_UNPACK_BUFFER, // Buffer used for pixel transfer operations.
}
