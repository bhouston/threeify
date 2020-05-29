
export enum BufferUsage {
    StaticDraw = WebGLRenderingContext.STATIC_DRAW, // The contents are intended to be specified once by the application, and used many times as the source for WebGL drawing and image specification commands.
    DynamicDraw = WebGLRenderingContext.DYNAMIC_DRAW, // The contents are intended to be respecified repeatedly by the application, and used many times as the source for WebGL drawing and image specification commands.
    StreamDraw = WebGL2RenderingContext.STREAM_DRAW, // The contents are intended to be specified once by the application, and used at most a few times as the source for WebGL drawing and image specification commands.    
    StaticRead = WebGL2RenderingContext.STATIC_READ, // The contents are intended to be specified once by reading data from WebGL, and queried many times by the application.
    DynamicRead = WebGL2RenderingContext.DYNAMIC_READ, // The contents are intended to be respecified repeatedly by reading data from WebGL, and queried many times by the application.
    StreamRead = WebGL2RenderingContext.STREAM_READ, // The contents are intended to be specified once by reading data from WebGL, and queried at most a few times by the application
    StaticCopy = WebGL2RenderingContext.STATIC_COPY, // The contents are intended to be specified once by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands.
    DynamicCopy = WebGL2RenderingContext.DYNAMIC_COPY, // The contents are intended to be respecified repeatedly by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands.
    StreamCopy = WebGL2RenderingContext.STREAM_COPY, // The contents are intended to be specified once by reading data from WebGL, and used at most a few times as the source for WebGL drawing and image specification commands.
}
