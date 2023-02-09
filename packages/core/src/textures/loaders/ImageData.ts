import { Color4 } from '@threeify/vector-math';

import { ArrayImage, DataType, PixelEncoding, Uint8ArrayImage } from '../..';

export function createSolidColorImageData(
  color: Color4,
  width = 1,
  height = 1,
  colorSpace: 'linear' | 'sRGB' = 'sRGB'
): Uint8ArrayImage {
  const data = new Uint8Array(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i + 0] = color.r * 255;
    data[i + 1] = color.g * 255;
    data[i + 2] = color.b * 255;
    data[i + 3] = color.a * 255;
  }

  return new ArrayImage<Uint8Array>(
    data,
    width,
    height,
    DataType.UnsignedByte,
    colorSpace === 'sRGB' ? PixelEncoding.sRGB : PixelEncoding.Linear
  );
}
