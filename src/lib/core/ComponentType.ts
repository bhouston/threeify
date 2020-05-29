//
// OpenGL-compatible component types for attribute buffers
//
// Authors:
// * @bhouston
//

const GL = WebGLRenderingContext;
const GL2 = WebGL2RenderingContext;

export enum ComponentType {

    Byte = GL.BYTE, // signed 8-bit integer, with values in [-128, 127]
    UnsignedByte = GL.UNSIGNED_BYTE, // unsigned 8-bit integer, with values in [0, 255]
    Short = GL.SHORT, // signed 16-bit integer, with values in [-32768, 32767]
    UnsignedShort = GL.UNSIGNED_SHORT, // unsigned 16-bit integer, with values in [0, 65535]
    Int = GL.INT, // unsigned 32-bit integer, with values in [0, ]
    UnsignedInt = GL.UNSIGNED_INT, // unsigned 32-bit integer, with values in [0, ]
    Float = GL.FLOAT, // 32-bit IEEE floating point number
    HalfFloat = GL2.HALF_FLOAT, //  16-bit IEEE floating point number

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

