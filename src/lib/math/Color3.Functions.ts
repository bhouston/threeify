import { Color3 } from './Color3.js';
import {
  EPSILON,
  equalsTolerance,
  parseSafeFloats,
  toSafeString
} from './Common.js';

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
export function color3Mix(
  a: Color3,
  b: Color3,
  t: number,
  result = new Color3()
): Color3 {
  const s = 1 - t;
  return result.set(a.r * s + b.r * t, a.g * s + b.g * t, a.b * s + b.b * t);
}
export function color3FromArray(
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
  return color3FromArray(parseSafeFloats(text), 0, result);
}

export function makeColor3FromHex(hex: number, result = new Color3()): Color3 {
  hex = Math.floor(hex);
  return result.set(
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255
  );
}

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

export function makeColor3FromHSL(
  h: number,
  s: number,
  l: number,
  result = new Color3()
): Color3 {
  // h,s,l ranges are in 0.0 - 1.0
  h = ((h % 1) + 1) % 1; // euclidean modulo
  s = Math.min(Math.max(s, 0), 1);
  l = Math.min(Math.max(l, 0), 1);

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

export function makeHexFromColor3(c: Color3): number {
  return ((c.r * 255) << 16) ^ ((c.g * 255) << 8) ^ ((c.b * 255) << 0);
}

export function makeHexStringFromColor3(c: Color3): string {
  return `000000${makeHexFromColor3(c).toString(16)}`.slice(-6);
}

type HSL = { h: number; s: number; l: number };
export function makeHSLFromColor3(c: Color3, target: HSL): HSL {
  // h,s,l ranges are in 0.0 - 1.0
  const { r, g, b } = c;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let hue = 0;
  let saturation = 0;
  const lightness = (min + max) / 2;

  if (min === max) {
    hue = 0;
    saturation = 0;
  } else {
    const delta = max - min;

    saturation =
      lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);

    switch (max) {
      case r:
        hue = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / delta + 2;
        break;
      case b:
        hue = (r - g) / delta + 4;
        break;
    }

    hue /= 6;
  }

  target.h = hue;
  target.s = saturation;
  target.l = lightness;

  return target;
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

export function hslToRGB(hsl: Color3, result = new Color3()): Color3 {
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
  const h = ((hsl.x % 1) + 1) % 1; // euclidean modulo
  const s = Math.min(Math.max(hsl.y, 0), 1);
  const l = Math.min(Math.max(hsl.z, 0), 1);

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

export function rgbToHSL(rgb: Color3, result = new Color3()): Color3 {
  // h,s,l ranges are in 0.0 - 1.0
  const { r, g, b } = rgb;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let hue = 0;
  let saturation = 0;
  const lightness = (min + max) / 2;

  if (min === max) {
    hue = 0;
    saturation = 0;
  } else {
    const delta = max - min;

    saturation =
      lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);

    switch (max) {
      case r:
        hue = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / delta + 2;
        break;
      case b:
        hue = (r - g) / delta + 4;
        break;
    }

    hue /= 6;
  }

  return result.set(hue, saturation, lightness);
}

export function hexToRGB(hex: number, result = new Color3()): Color3 {
  hex = Math.floor(hex);
  return result.set(
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255
  );
}

export function rgbToHex(rgb: Color3): number {
  return ((rgb.r * 255) << 16) ^ ((rgb.g * 255) << 8) ^ ((rgb.b * 255) << 0);
}
