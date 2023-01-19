import { DataType } from '../renderers/webgl/textures/DataType.js';
import { PixelEncoding } from './PixelEncoding.js';

export class ArrayBufferImage {
  constructor(
    public data: ArrayBuffer,
    public width: number,
    public height: number,
    public dataType = DataType.UnsignedByte,
    public pixelEncoding = PixelEncoding.sRGB
  ) {}
}
