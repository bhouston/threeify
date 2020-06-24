export function normalizedByteToFloats(
  sourceArray: Uint8Array,
  result: Float32Array | undefined = undefined,
): Float32Array {
  const scale = 1.0 / 255.0;
  if (result === undefined) {
    result = new Float32Array(sourceArray.length);
  }
  for (let i = 0; i < sourceArray.length; i++) {
    result[i] = sourceArray[i] * scale;
  }
  return result;
}
export function floatsToNormalizedBytes(
  sourceArray: Float32Array,
  result: Uint8Array | undefined = undefined,
): Uint8Array {
  const scale = 255.0;
  if (result === undefined) {
    result = new Uint8Array(sourceArray.length);
  }
  for (let i = 0; i < sourceArray.length; i++) {
    result[i] = sourceArray[i] * scale;
  }
  return result;
}
