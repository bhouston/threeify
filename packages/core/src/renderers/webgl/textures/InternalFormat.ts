import { GL } from '../GL.js';
import { DataType } from './DataType.js';
import { PixelFormat } from './PixelFormat.js';

export enum InternalFormat {
  R8 = GL.R8,
  R8UI = GL.R8UI,
  R8I = GL.R8I,
  R16UI = GL.R16UI,
  R16I = GL.R16I,
  R32UI = GL.R32UI,
  R32I = GL.R32I,
  RG8 = GL.RG8,
  RG8UI = GL.RG8UI,
  RG8I = GL.RG8I,
  RG16UI = GL.RG16UI,
  RG16I = GL.RG16I,
  RG32UI = GL.RG32UI,
  RG32I = GL.RG32I,
  RGB8 = GL.RGB8,
  RGBA8 = GL.RGBA8,
  SRGB8_ALPHA8 = GL.SRGB8_ALPHA8,
  RGBA4 = GL.RGBA4,
  RGB565 = GL.RGB565,
  RGB5_A1 = GL.RGB5_A1,
  RGB10_A2 = GL.RGB10_A2,
  RGBA8UI = GL.RGBA8UI,
  RGBA8I = GL.RGBA8I,
  RGB10_A2UI = GL.RGB10_A2UI,
  RGBA16UI = GL.RGBA16UI,
  RGBA16I = GL.RGBA16I,
  RGBA32I = GL.RGBA32I,
  RGBA32UI = GL.RGBA32UI,
  DepthComponent16 = GL.DEPTH_COMPONENT16,
  DepthComponent24 = GL.DEPTH_COMPONENT24,
  DepthComponentT32F = GL.DEPTH_COMPONENT32F,
  DepthStencil = GL.DEPTH_STENCIL,
  Depth24_Stencil8 = GL.DEPTH24_STENCIL8,
  Depth32F_Stencil8 = GL.DEPTH32F_STENCIL8,
  Stencil_Index8 = GL.STENCIL_INDEX8,
  R16F = GL.R16F,
  R32F = GL.R32F,
  RG16F = GL.RG16F,
  RG32F = GL.RG32F,
  RGBA16F = GL.RGBA16F,
  RGBA32F = GL.RGBA32F
}

export function internalFormatToDataType(
  internalFormat: InternalFormat
): DataType {
  switch (internalFormat) {
    case InternalFormat.RGBA8:
      return DataType.UnsignedByte;
    case InternalFormat.RGBA16F:
      return DataType.HalfFloat;
    case InternalFormat.RGBA32F:
      return DataType.Float;
    case InternalFormat.DepthComponent24:
      return DataType.UnsignedInt;
    default:
      throw new Error(`unsupported internalFormat: ${internalFormat}`);
  }
}

export function internalFormatToPixelFormat(
  internalFormat: InternalFormat
): PixelFormat {
  switch (internalFormat) {
    case InternalFormat.R8:
    case InternalFormat.R8I:
    case InternalFormat.R8UI:
    case InternalFormat.R16F:
    case InternalFormat.R16I:
    case InternalFormat.R16UI:
    case InternalFormat.R32F:
    case InternalFormat.R32I:
    case InternalFormat.R32UI:
      return PixelFormat.R;

    case InternalFormat.RG8:
    case InternalFormat.RG8I:
    case InternalFormat.RG8UI:
    case InternalFormat.RG16F:
    case InternalFormat.RG16I:
    case InternalFormat.RG16UI:
    case InternalFormat.RG32F:
    case InternalFormat.RG32I:
    case InternalFormat.RG32UI:
      return PixelFormat.RG;

    case InternalFormat.RGB8:
    case InternalFormat.RGB565:
      return PixelFormat.RGB;

    case InternalFormat.RGBA8:
    case InternalFormat.RGBA8I:
    case InternalFormat.RGBA8UI:
    case InternalFormat.RGBA16F:
    case InternalFormat.RGBA16I:
    case InternalFormat.RGBA16UI:
    case InternalFormat.RGBA32F:
    case InternalFormat.RGBA32I:
    case InternalFormat.RGBA32UI:
    case InternalFormat.SRGB8_ALPHA8:
    case InternalFormat.RGB10_A2:
    case InternalFormat.RGB10_A2UI:
    case InternalFormat.RGBA4:
    case InternalFormat.RGB5_A1:
      return PixelFormat.RGBA;

    case InternalFormat.DepthComponent16:
    case InternalFormat.DepthComponent24:
    case InternalFormat.DepthComponentT32F:
      return PixelFormat.DepthComponent;

    default:
      throw new Error(`unsupported internalFormat: ${internalFormat}`);
  }
}
