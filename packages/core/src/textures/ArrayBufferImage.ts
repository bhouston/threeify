import { DataType } from '../renderers/webgl/textures/DataType.js';
import { PixelEncoding } from './PixelEncoding.js';

export class ArrayImage<T extends ArrayBufferView> {
  constructor(
    public data: T,
    public width: number,
    public height: number,
    public dataType = DataType.UnsignedByte,
    public pixelEncoding = PixelEncoding.sRGB
  ) {}
}

export class Float32ArrayImage extends ArrayImage<Float32Array> {
  constructor(
    data: Float32Array,
    width: number,
    height: number,
    pixelEncoding = PixelEncoding.Linear
  ) {
    super(data, width, height, DataType.Float, pixelEncoding);
  }
}

export class Uint8ArrayImage extends ArrayImage<Uint8Array> {
  constructor(
    data: Uint8Array,
    width: number,
    height: number,
    pixelEncoding = PixelEncoding.sRGB
  ) {
    super(data, width, height, DataType.UnsignedByte, pixelEncoding);
  }
}
export class Float16ArrayImage extends ArrayImage<Uint16Array> {
  constructor(
    data: Uint16Array,
    width: number,
    height: number,
    pixelEncoding = PixelEncoding.Linear
  ) {
    super(data, width, height, DataType.HalfFloat, pixelEncoding);
  }
}
