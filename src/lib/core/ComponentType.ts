export enum ComponentType {

    Byte = WebGLRenderingContext.BYTE, // signed 8-bit integer, with values in [-128, 127]
    UnsignedByte = WebGLRenderingContext.UNSIGNED_BYTE, // unsigned 8-bit integer, with values in [0, 255]
    Short = WebGLRenderingContext.SHORT, // signed 16-bit integer, with values in [-32768, 32767]
    UnsignedShort = WebGLRenderingContext.UNSIGNED_SHORT, // unsigned 16-bit integer, with values in [0, 65535]
    Int = WebGLRenderingContext.INT, // unsigned 32-bit integer, with values in [0, ]
    UnsignedInt = WebGLRenderingContext.UNSIGNED_INT, // unsigned 32-bit integer, with values in [0, ]
    Float = WebGLRenderingContext.FLOAT, // 32-bit IEEE floating point number
    HalfFloat = WebGL2RenderingContext.HALF_FLOAT, //  16-bit IEEE floating point number

}

export function componentTypeSizeOf( componentType: ComponentType ) {

    switch( componentType ) {
        case ComponentType.Byte: return 1;
        case ComponentType.UnsignedByte: return 1;
        case ComponentType.Short: return 2;
        case ComponentType.UnsignedShort: return 2;
        case ComponentType.Int: return 4;
        case ComponentType.UnsignedInt: return 4;
        case ComponentType.HalfFloat: return 2;
        case ComponentType.Float: return 4;
    }

    throw new Error( "unknown data type:" + componentType );
}

