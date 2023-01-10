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

export function degreesToRadians(a: number) {
  return a * (Math.PI / 180);
}

export function radiansToDegrees(a: number) {
  return a * (180 / Math.PI);
}

export function clamp(a: number, min: number, max: number): number {
  return a < min ? min : a > max ? max : a;
}
