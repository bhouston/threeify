import { Color3 } from './Color3';
import { ColorHSV } from './ColorHSV';
import { clamp, positiveModulo } from './Functions';

export function hsvToColor3(hsv: ColorHSV, result = new Color3()): Color3 {
  const h = positiveModulo(hsv.h, 1);
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
