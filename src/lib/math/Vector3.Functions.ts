import { Spherical } from './Spherical';
import { Vector3 } from './Vector3';

export function crossFromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3, result = new Vector3()): Vector3 {
  // TODO: replace with just number math, no classes?  Or just use temporary Vector3 objects
  result.copy(c).sub(b);
  const v = a.clone().sub(b);
  return result.cross(v);
}

export function makeVector3FromDelta(a: Vector3, b: Vector3, result = new Vector3()): Vector3 {
  return result.copy(a).sub(b);
}

export function makeVector3FromSpherical(s: Spherical): Vector3 {
  return makeVector3FromSphericalCoords(s.radius, s.phi, s.theta);
}

export function makeVector3FromSphericalCoords(radius: number, phi: number, theta: number): Vector3 {
  const sinPhiRadius = Math.sin(phi) * radius;

  return new Vector3(
    sinPhiRadius * Math.sin(theta),
    Math.cos(phi) * radius,
    sinPhiRadius * Math.cos(theta),
  );
}

// static/instance method to calculate barycentric coordinates
// based on: http://www.blackpawn.com/texts/pointinpoly/default.html
export function pointToBaryCoords(a: Vector3, b: Vector3, c: Vector3, point: Vector3, result = new Vector3()): Vector3 {
  const v0 = makeVector3FromDelta(c, b);
  const v1 = makeVector3FromDelta(b, a);
  const v2 = makeVector3FromDelta(point, a);

  const dot00 = v0.dot(v0);
  const dot01 = v0.dot(v1);
  const dot02 = v0.dot(v2);
  const dot11 = v1.dot(v1);
  const dot12 = v1.dot(v2);

  const denom = dot00 * dot11 - dot01 * dot01;

  // collinear or singular triangle
  if (denom === 0) {
    // arbitrary location outside of triangle?
    // not sure if this is the best idea, maybe should be returning undefined
    return result.set(-2, -1, -1);
  }

  const invDenom = 1 / denom;
  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  // barycentric coordinates must always sum to 1
  return result.set(1 - u - v, v, u);
}

export function makeVector3FromBaryCoordWeights(
  baryCoord: Vector3,
  a: Vector3,
  b: Vector3,
  c: Vector3,
  result = new Vector3(),
): Vector3 {
  const v = baryCoord;
  return result.set(
    a.x * v.x + b.x * v.y + c.x * v.z,
    a.y * v.x + b.y * v.y + c.y * v.z,
    a.z * v.x + b.z * v.y + c.z * v.z,
  );
}

export function makeColor3FromHex(hex: number, result = new Vector3()): Vector3 {
  hex = Math.floor(hex);
  return result.set(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255);
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

export function makeColor3FromHSL(h: number, s: number, l: number, result = new Vector3()): Vector3 {
  // h,s,l ranges are in 0.0 - 1.0
  h = ((h % 1.0) + 1.0) % 1.0; // euclidean modulo
  s = Math.min(Math.max(s, 0.0), 1.0);
  l = Math.min(Math.max(l, 0.0), 1.0);

  if (s === 0) {
    return result.set(1, 1, 1);
  }

  const p = l <= 0.5 ? l * (1.0 + s) : l + s - l * s;
  const q = 2.0 * l - p;

  return result.set(hue2rgb(q, p, h + 1.0 / 3.0), hue2rgb(q, p, h), hue2rgb(q, p, h - 1.0 / 3.0));
}

export function makeHexFromColor3(c: Vector3): number {
  return ((c.r * 255) << 16) ^ ((c.g * 255) << 8) ^ ((c.b * 255) << 0);
}

export function makeHexStringFromColor3(c: Vector3): string {
  return (`000000${makeHexFromColor3(c).toString(16)}`).slice(-6);
}

type HSL = { h: number; s: number; l: number };
export function makeHSLFromColor3(c: Vector3, target: HSL): HSL {
  // h,s,l ranges are in 0.0 - 1.0
  const { r } = c;
  const { g } = c;
  const { b } = c;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let hue = 0;
  let saturation = 0;
  const lightness = (min + max) / 2.0;

  if (min === max) {
    hue = 0;
    saturation = 0;
  } else {
    const delta = max - min;

    saturation = lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);

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
makeMatrix3Concatenation
		return 'rgb(' + ( ( this.r * 255 ) | 0 ) + ',' + ( ( this.g * 255 ) | 0 ) + ',' + ( ( this.b * 255 ) | 0 ) + ')';

	},

	offsetHSL: function ( h, s, l ) {

		this.getHSL( _hslA );

		_hslA.h += h; _hslA.s += s; _hslA.l += l;

		this.setHSL( _hslA.h, _hslA.s, _hslA.l );

		return this;

	},
*/
