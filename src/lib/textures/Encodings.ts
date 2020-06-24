export function rgbe8ToRGBF32(
  sourceArray: Uint8Array,
  sourceOffset: number,
  destArray: Float32Array,
  destOffset: number,
): void {
  const e = sourceArray[sourceOffset + 3];
  const scale = Math.pow(2.0, e - 128.0) / 255.0;

  destArray[destOffset + 0] = sourceArray[sourceOffset + 0] * scale;
  destArray[destOffset + 1] = sourceArray[sourceOffset + 1] * scale;
  destArray[destOffset + 2] = sourceArray[sourceOffset + 2] * scale;
}
