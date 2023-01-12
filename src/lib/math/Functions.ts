export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
export function lerp(a: number, b: number, t: number): number {
  return (1 - t) * a + t * b;
}
export function delta(a: number, b: number): number {
  return Math.abs(a - b);
}

export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function radToDeg(radian: number): number {
  return radian * (180 / Math.PI);
}

export function isPow2(value: number): boolean {
  return (value & (value - 1)) === 0 && value !== 0;
}

export function ceilPow2(value: number): number {
  return 2 ** Math.ceil(Math.log2(value));
}

export function floorPow2(value: number): number {
  return 2 ** Math.floor(Math.log2(value));
}

const cSeparator = /[^\d+.-]+/;

export function parseSafeFloat(text: string, fallback = 0): number {
  try {
    return Number.parseFloat(text);
  } catch {
    return fallback;
  }
}
export function parseSafeFloats(text: string, fallback = 0): number[] {
  return text
    .split(cSeparator)
    .filter(Boolean)
    .map((value) => parseSafeFloat(value, fallback));
}

export function toSafeString(elements: number[]): string {
  return `[${elements.join(',')}]`;
}

export const EPSILON = 0.000001; // chosen from gl-matrix

export function equalsTolerance(
  a: number,
  b: number,
  tolerance: number = EPSILON
): boolean {
  return Math.abs(a - b) < tolerance;
}

// taken from gl-matrix
export function equalsAutoTolerance(a: number, b: number): boolean {
  return Math.abs(a - b) <= EPSILON * Math.max(1, Math.abs(a), Math.abs(b));
}
