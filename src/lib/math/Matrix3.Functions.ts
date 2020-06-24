import { Matrix3 } from "./Matrix3";
import { Vector2 } from "./Vector2";

export function matrix3Determinant(m: Matrix3): number {
  const te = m.elements;

  const a = te[0],
    b = te[1],
    c = te[2],
    d = te[3],
    e = te[4],
    f = te[5],
    g = te[6],
    h = te[7],
    i = te[8];

  return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
}

export function makeMatrix3Transpose(m: Matrix3, result = new Matrix3()): Matrix3 {
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

export function makeMatrix3Inverse(m: Matrix3, result = new Matrix3()): Matrix3 {
  const e = m.elements;

  const n11 = e[0],
    n21 = e[1],
    n31 = e[2],
    n12 = e[3],
    n22 = e[4],
    n32 = e[5],
    n13 = e[6],
    n23 = e[7],
    n33 = e[8],
    t11 = n33 * n22 - n32 * n23,
    t12 = n32 * n13 - n33 * n12,
    t13 = n23 * n12 - n22 * n13,
    det = n11 * t11 + n21 * t12 + n31 * t13;

  if (det === 0) {
    throw new Error("can not invert degenerate matrix");
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

export function makeMatrix3Translation(t: Vector2, result = new Matrix3()): Matrix3 {
  return result.set(1, 0, t.x, 0, 1, t.y, 0, 0, 1);
}

export function makeMatrix3RotationFromAngle(angle: number, result = new Matrix3()): Matrix3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return result.set(c, -s, 0, s, c, 0, 0, 0, 1);
}

export function makeMatrix3Scale(s: Vector2, result = new Matrix3()): Matrix3 {
  return result.set(s.x, 0, 0, 0, s.y, 0, 0, 0, 1.0);
}
