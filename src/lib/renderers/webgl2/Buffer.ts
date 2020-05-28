import { Context } from "./Context";

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

export class Buffer {

    context: Context;
    target: BufferTarget;
    usage: BufferUsage;
    glBuffer: WebGLBuffer;

    constructor(context: Context, target: BufferTarget, arrayBuffer: ArrayBuffer, usage: BufferUsage = BufferUsage.StaticDraw) {

        this.context = context;
        this.target = target;
        this.usage = usage;

        let gl = context.gl;
        // Create a buffer and put three 2d clip space points in it
        {
            let glBuffer = gl.createBuffer();
            if (!glBuffer) {
                throw new Error("can not create buffer");
            }
            this.glBuffer = glBuffer;
        }

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(this.target, this.glBuffer);

        // load data
        gl.bufferData(this.target, arrayBuffer, this.usage);

    }

}
