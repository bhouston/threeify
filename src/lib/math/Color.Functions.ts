import { Color } from "./Color";

export function makeColorFromHex(c: Color, hex: number): Color {
  hex = Math.floor(hex);

  c.r = ((hex >> 16) & 255) / 255;
  c.g = ((hex >> 8) & 255) / 255;
  c.b = (hex & 255) / 255;

  return c;
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

export function makeColorFromHSL(c: Color, h: number, s: number, l: number): Color {
  // h,s,l ranges are in 0.0 - 1.0
  h = ((h % 1.0) + 1.0) % 1.0; // euclidean modulo
  s = Math.min(Math.max(s, 0.0), 1.0);
  l = Math.min(Math.max(l, 0.0), 1.0);

  if (s === 0) {
    c.r = c.g = c.b = l;
  } else {
    const p = l <= 0.5 ? l * (1.0 + s) : l + s - l * s;
    const q = 2.0 * l - p;

    c.r = hue2rgb(q, p, h + 1.0 / 3.0);
    c.g = hue2rgb(q, p, h);
    c.b = hue2rgb(q, p, h - 1.0 / 3.0);
  }

  return c;
}
