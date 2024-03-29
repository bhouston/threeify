const arrayBuffer = new ArrayBuffer(12 * 16);
const floatArray = new Float32Array(arrayBuffer);
const intArray = new Int32Array(arrayBuffer);

export function hashFloat1(v: number): number {
  floatArray[0] = v;
  return intArray[0];
}

export function hashFloat2(v0: number, v1: number): number {
  floatArray[0] = v0;
  floatArray[1] = v1;

  // https://github.com/BabylonJS/Babylon.js/blob/master/src/Maths/math.vector.ts#L42
  const hash = intArray[0];
  return (hash * 397) ^ intArray[1];
}

export function hashFloat3(v0: number, v1: number, v2: number): number {
  floatArray[0] = v0;
  floatArray[1] = v1;
  floatArray[2] = v2;

  // https://github.com/BabylonJS/Babylon.js/blob/master/src/Maths/math.vector.ts#L718
  let hash = intArray[0] | 0;
  hash = (hash * 397) ^ (intArray[1] | 0);
  return (hash * 397) ^ (intArray[2] | 0);
}

export function hashFloat4(
  v0: number,
  v1: number,
  v2: number,
  v3: number
): number {
  floatArray[0] = v0;
  floatArray[1] = v1;
  floatArray[2] = v2;
  floatArray[3] = v3;

  // https://github.com/BabylonJS/Babylon.js/blob/master/src/Maths/math.vector.ts#L718
  let hash = intArray[0] | 0;
  hash = (hash * 397) ^ (intArray[1] | 0);
  hash = (hash * 397) ^ (intArray[2] | 0);
  return (hash * 397) ^ (intArray[3] | 0);
}

export function hashFloatArray(elements: number[]): number {
  for (let i = 0; i < elements.length; i++) {
    floatArray[i] = elements[i];
  }
  // https://github.com/BabylonJS/Babylon.js/blob/master/src/Maths/math.vector.ts#L4017
  let hash = intArray[0] | 0;
  for (let i = 1; i < 16; i++) {
    hash = (hash * 397) ^ (intArray[i] | 0);
  }
  return hash;
}
