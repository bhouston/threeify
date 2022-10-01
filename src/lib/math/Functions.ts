export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180.0);
}

export function radToDeg(radian: number): number {
  return radian * (180.0 / Math.PI);
}

export function isPow2(value: number): boolean {
  return (value & (value - 1)) === 0 && value !== 0;
}

export function ceilPow2(value: number): number {
  return 2 ** Math.ceil(Math.log(value) / Math.LN2);
}

export function floorPow2(value: number): number {
  return 2 ** Math.floor(Math.log(value) / Math.LN2);
}
