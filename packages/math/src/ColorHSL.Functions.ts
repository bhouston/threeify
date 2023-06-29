import { Color3 } from './Color3.js';
import { ColorHSL } from './ColorHSL.js';
import { clamp, positiveModulo } from './Functions.js';

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

export function hslToColor3(hsl: ColorHSL, result = new Color3()): Color3 {
  // h,s,l ranges are in 0.0 - 1.0
  const h = positiveModulo(hsl.h, 1);
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

export function color3ToHsl(rgb: Color3, result = new ColorHSL()): ColorHSL {
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
