export enum DataType {

    Byte = WebGLRenderingContext.BYTE, // signed 8-bit integer, with values in [-128, 127]
    UnsignedByte = WebGLRenderingContext.UNSIGNED_BYTE, // unsigned 8-bit integer, with values in [0, 255]
    Short = WebGLRenderingContext.SHORT, // signed 16-bit integer, with values in [-32768, 32767]
    UnsignedShort = WebGLRenderingContext.UNSIGNED_SHORT, // unsigned 16-bit integer, with values in [0, 65535]
    Float = WebGLRenderingContext.FLOAT, // 32-bit IEEE floating point number
    HalfFloat = WebGL2RenderingContext.HALF_FLOAT, //  16-bit IEEE floating point number

}