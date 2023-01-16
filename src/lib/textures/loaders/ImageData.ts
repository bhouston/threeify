import { Color4 } from '../../math/Color4';

export function createSolidColorImageData(
  color: Color4,
  width = 1,
  height = 1,
  colorSpace: PredefinedColorSpace = 'srgb'
): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i + 0] = color.r * 255;
    data[i + 1] = color.g * 255;
    data[i + 2] = color.b * 255;
    data[i + 3] = color.a * 255;
  }
  return {
    data,
    width,
    height,
    colorSpace
  } as ImageData;
}
