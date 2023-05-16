import { Color3 } from './Color3.js';
import { ColorHSL } from './ColorHSL.js';
import { ColorHSV } from './ColorHSV.js';
import {
  clamp,
  EPSILON,
  equalsTolerance,
  parseSafeFloats,
  toSafeString
} from './Functions.js';

export function color3Equals(
  a: Color3,
  b: Color3,
  tolerance: number = EPSILON
): boolean {
  return (
    equalsTolerance(a.r, b.r, tolerance) &&
    equalsTolerance(a.g, b.g, tolerance) &&
    equalsTolerance(a.b, b.b, tolerance)
  );
}
export function color3Add(a: Color3, b: Color3, result = new Color3()): Color3 {
  return result.set(a.r + b.r, a.g + b.g, a.b + b.b);
}
export function color3Subtract(
  a: Color3,
  b: Color3,
  result = new Color3()
): Color3 {
  return result.set(a.r - b.r, a.g - b.g, a.b - b.b);
}
export function color3MultiplyByScalar(
  a: Color3,
  b: number,
  result = new Color3()
): Color3 {
  return result.set(a.r * b, a.g * b, a.b * b);
}
export function color3Negate(a: Color3, result = new Color3()): Color3 {
  return result.set(-a.r, -a.g, -a.b);
}
export function color3Length(a: Color3): number {
  return Math.sqrt(color3Dot(a, a));
}
export function color3Normalize(a: Color3, result = new Color3()): Color3 {
  const invLength = 1 / color3Length(a);
  return color3MultiplyByScalar(a, invLength, result);
}
export function color3Dot(a: Color3, b: Color3): number {
  return a.r * b.r + a.g * b.g + a.b * b.b;
}
export function color3Lerp(
  a: Color3,
  b: Color3,
  t: number,
  result = new Color3()
): Color3 {
  const s = 1 - t;
  return result.set(a.r * s + b.r * t, a.g * s + b.g * t, a.b * s + b.b * t);
}
export function arrayToColor3(
  array: Float32Array | number[],
  offset = 0,
  result = new Color3()
): Color3 {
  return result.set(array[offset + 0], array[offset + 1], array[offset + 2]);
}
export function color3ToArray(
  a: Color3,
  array: Float32Array | number[],
  offset = 0
): void {
  array[offset + 0] = a.r;
  array[offset + 1] = a.g;
  array[offset + 2] = a.b;
}
export function color3ToString(a: Color3): string {
  return toSafeString([a.r, a.g, a.b]);
}
export function color3Parse(text: string, result = new Color3()): Color3 {
  return arrayToColor3(parseSafeFloats(text), 0, result);
}

/*

	getStyle: function () {
makeMat3Concatenation
		return 'rgb(' + ( ( this.r * 255 ) | 0 ) + ',' + ( ( this.g * 255 ) | 0 ) + ',' + ( ( this.b * 255 ) | 0 ) + ')';

	},

	offsetHSL: function ( h, s, l ) {

		this.getHSL( _hslA );

		_hslA.h += h; _hslA.s += s; _hslA.l += l;

		this.setHSL( _hslA.h, _hslA.s, _hslA.l );

		return this;

	},
*/

export function hsvToColor3(hsv: ColorHSV, result = new Color3()): Color3 {
  const h = hsv.h % 1;
  const s = clamp(hsv.s, 0, 1);
  const v = clamp(hsv.v, 0, 1);

  if (s === 0) {
    return result.set(v, v, v);
  }

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      return result.set(v, t, p);
    case 1:
      return result.set(q, v, p);
    case 2:
      return result.set(p, v, t);
    case 3:
      return result.set(p, q, v);
    case 4:
      return result.set(t, p, v);
    case 5:
      return result.set(v, p, q);
    default:
      return result.set(v, t, p);
  }
}

export function color3ToHsv(color: Color3, result = new ColorHSV()): ColorHSV {
  const { r, g, b } = color;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s = 0;
  const v = max;

  const delta = max - min;

  if (delta !== 0) {
    s = delta / max;

    const deltaR = ((max - r) / 6 + delta / 2) / delta;
    const deltaG = ((max - g) / 6 + delta / 2) / delta;
    const deltaB = ((max - b) / 6 + delta / 2) / delta;

    switch (max) {
      case r: {
        h = deltaB - deltaG;
        break;
      }
      case g: {
        h = 1 / 3 + deltaR - deltaB;
        break;
      }
      case b: {
        h = 2 / 3 + deltaG - deltaR;
        break;
      }
      // No default
    }

    if (h < 0) {
      h += 1;
    }

    if (h > 1) {
      h -= 1;
    }
  }

  return result.set(h, s, v);
}

export function hslToColor3(hsl: ColorHSL, result = new Color3()): Color3 {
  function hue2rgb(p: number, q: number, t: number): number {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * 6 * (2 / 3 - t);
    }

    return p;
  }

  // h,s,l ranges are in 0.0 - 1.0
  const h = ((hsl.h % 1) + 1) % 1; // euclidean modulo
  const s = clamp(hsl.s, 0, 1);
  const l = clamp(hsl.l, 0, 1);

  if (s === 0) {
    return result.set(1, 1, 1);
  }

  const p = l <= 0.5 ? l * (1 + s) : l + s - l * s;
  const q = 2 * l - p;

  return result.set(
    hue2rgb(q, p, h + 1 / 3),
    hue2rgb(q, p, h),
    hue2rgb(q, p, h - 1 / 3)
  );
}

export function color3ToHSL(rgb: Color3, result = new ColorHSL()): ColorHSL {
  // h,s,l ranges are in 0.0 - 1.0
  const { r, g, b } = rgb;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s = 0;
  const l = (min + max) / 2;

  if (min === max) {
    h = 0;
    s = 0;
  } else {
    const delta = max - min;

    s = l <= 0.5 ? delta / (max + min) : delta / (2 - max - min);

    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }

    h /= 6;
  }

  return result.set(h, s, l);
}

export function hexToColor3(hex: number, result = new Color3()): Color3 {
  hex = Math.floor(hex);
  return result.set(
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255
  );
}

export function color3ToHex(rgb: Color3): number {
  return ((rgb.r * 255) << 16) ^ ((rgb.g * 255) << 8) ^ ((rgb.b * 255) << 0);
}

export function color3ToHexString(rgb: Color3): string {
  return `${color3ToHex(rgb).toString(16)}`;
}

export function hexStringToColor3(hex: string, result = new Color3()): Color3 {
  return hexToColor3(Number.parseInt(hex.replace(/^#/, ''), 16), result);
}
