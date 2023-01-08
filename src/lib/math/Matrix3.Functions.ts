import { Matrix3 } from './Matrix3.js';
import { Vector2 } from './Vector2.js';

export function makeMatrix3Concatenation(
  a: Matrix3,
  b: Matrix3,
  result = new Matrix3()
): Matrix3 {
  const ae = a.elements;
  const be = b.elements;
  const te = result.elements;

  const a11 = ae[0];
  const a12 = ae[3];
  const a13 = ae[6];
  const a21 = ae[1];
  const a22 = ae[4];
  const a23 = ae[7];
  const a31 = ae[2];
  const a32 = ae[5];
  const a33 = ae[8];

  const b11 = be[0];
  const b12 = be[3];
  const b13 = be[6];
  const b21 = be[1];
  const b22 = be[4];
  const b23 = be[7];
  const b31 = be[2];
  const b32 = be[5];
  const b33 = be[8];

  te[0] = a11 * b11 + a12 * b21 + a13 * b31;
  te[3] = a11 * b12 + a12 * b22 + a13 * b32;
  te[6] = a11 * b13 + a12 * b23 + a13 * b33;

  te[1] = a21 * b11 + a22 * b21 + a23 * b31;
  te[4] = a21 * b12 + a22 * b22 + a23 * b32;
  te[7] = a21 * b13 + a22 * b23 + a23 * b33;

  te[2] = a31 * b11 + a32 * b21 + a33 * b31;
  te[5] = a31 * b12 + a32 * b22 + a33 * b32;
  te[8] = a31 * b13 + a32 * b23 + a33 * b33;

  return result;
}

export function matrix3Determinant(m: Matrix3): number {
  const te = m.elements;

  const a = te[0];
  const b = te[1];
  const c = te[2];
  const d = te[3];
  const e = te[4];
  const f = te[5];
  const g = te[6];
  const h = te[7];
  const i = te[8];

  return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
}

export function makeMatrix3Transpose(
  m: Matrix3,
  result = new Matrix3()
): Matrix3 {
  let tmp;
  const me = result.copy(m).elements;

  // TODO: replace this with just reading from me and setting re, no need for a temporary
  tmp = me[1];
  me[1] = me[3];
  me[3] = tmp;
  tmp = me[2];
  me[2] = me[6];
  me[6] = tmp;
  tmp = me[5];
  me[5] = me[7];
  me[7] = tmp;

  return result;
}

export function makeMatrix3Inverse(
  m: Matrix3,
  result = new Matrix3()
): Matrix3 {
  const e = m.elements;

  const n11 = e[0];
  const n21 = e[1];
  const n31 = e[2];
  const n12 = e[3];
  const n22 = e[4];
  const n32 = e[5];
  const n13 = e[6];
  const n23 = e[7];
  const n33 = e[8];
  const t11 = n33 * n22 - n32 * n23;
  const t12 = n32 * n13 - n33 * n12;
  const t13 = n23 * n12 - n22 * n13;
  const det = n11 * t11 + n21 * t12 + n31 * t13;

  if (det === 0) {
    throw new Error('can not invert degenerate matrix');
  }

  const detInv = 1 / det;

  const re = result.elements;

  // TODO: replace with a set
  re[0] = t11 * detInv;
  re[1] = (n31 * n23 - n33 * n21) * detInv;
  re[2] = (n32 * n21 - n31 * n22) * detInv;

  re[3] = t12 * detInv;
  re[4] = (n33 * n11 - n31 * n13) * detInv;
  re[5] = (n31 * n12 - n32 * n11) * detInv;

  re[6] = t13 * detInv;
  re[7] = (n21 * n13 - n23 * n11) * detInv;
  re[8] = (n22 * n11 - n21 * n12) * detInv;

  return result;
}

export function makeMatrix3Translation(
  t: Vector2,
  result = new Matrix3()
): Matrix3 {
  return result.set(1, 0, t.x, 0, 1, t.y, 0, 0, 1);
}

export function makeMatrix3RotationFromAngle(
  angle: number,
  result = new Matrix3()
): Matrix3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return result.set(c, -s, 0, s, c, 0, 0, 0, 1);
}

export function makeMatrix3Scale(s: Vector2, result = new Matrix3()): Matrix3 {
  return result.set(s.x, 0, 0, 0, s.y, 0, 0, 0, 1);
}

export function composeMatrix3(
  translation: Vector2,
  rotation: number,
  scale: Vector2,
  result = new Matrix3()
): Matrix3 {
  const te = result.elements;

  const c = Math.cos(rotation);
  const s = Math.sin(rotation);

  te[0] = c * scale.x;
  te[1] = -s * scale.y;
  te[2] = translation.x;

  te[3] = s * scale.x;
  te[4] = c * scale.y;
  te[5] = translation.y;

  te[6] = 0;
  te[7] = 0;
  te[8] = 1;

  return result;
}

export function decomposeMatrix3(
  m: Matrix3,
  translation = new Vector2(),
  rotation = 0,
  scale = new Vector2()
): { translation: Vector2; rotation: number; scale: Vector2 } {
  const te = m.elements;

  let sx = new Vector2(te[0], te[1]).length();
  const sy = new Vector2(te[3], te[4]).length();

  // if determine is negative, we need to invert one scale
  const det = matrix3Determinant(m);
  if (det < 0) {
    sx = -sx;
  }

  translation.x = te[2];
  translation.y = te[5];

  rotation = Math.atan2(-te[1] / sy, te[4] / sy);

  scale.x = sx;
  scale.y = sy;

  return { translation, rotation, scale };
}
