import {
  delta,
  EPSILON,
  equalsTolerance,
  parseSafeFloats,
  toSafeString
} from './Functions.js';
import { Mat3 } from './Mat3.js';
import { Mat4 } from './Mat4.js';
import { vec2Length } from './Vec2.Functions.js';
import { Vec2 } from './Vec2.js';
import { Vec3 } from './Vec3.js';
import { Vec4 } from './Vec4.js';

export function mat3Delta(a: Mat3, b: Mat3): number {
  let deltaSum = 0;
  for (let i = 0; i < Mat3.NUM_ELEMENTS; i++) {
    deltaSum = delta(a.elements[i], b.elements[i]);
  }
  return deltaSum;
}

export function mat3Zero(result = new Mat3()): Mat3 {
  return result.set([0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

export function mat3Identity(result = new Mat3()): Mat3 {
  return result.set([1, 0, 0, 0, 1, 0, 0, 0, 1]);
}

export function mat3SetRow3(
  m: Mat3,
  rowIndex: number,
  row: Vec3,
  result = new Mat3()
): Mat3 {
  const re = result.set(m.elements).elements;
  const base = Number(rowIndex) * Mat3.NUM_ROWS;
  re[base + 0] = row.x;
  re[base + 1] = row.y;
  re[base + 2] = row.z;
  return result;
}

export function mat3GetRow3(
  m: Mat3,
  rowIndex: number,
  result = new Vec3()
): Vec3 {
  const base = rowIndex * Mat3.NUM_ROWS;
  return result.set(
    m.elements[base + 0],
    m.elements[base + 1],
    m.elements[base + 2]
  );
}

export function mat3SetColumn3(
  m: Mat3,
  columnIndex: number,
  column: Vec3,
  result = new Mat3()
): Mat3 {
  const re = result.set(m.elements).elements;
  const stride = Mat3.NUM_COLUMNS;
  re[columnIndex + stride * 0] = column.x;
  re[columnIndex + stride * 1] = column.y;
  re[columnIndex + stride * 2] = column.z;
  return result;
}

export function mat3GetColumn3(
  m: Mat3,
  columnIndex: number,
  result = new Vec3()
): Vec3 {
  const stride = Mat3.NUM_COLUMNS;
  return result.set(
    m.elements[columnIndex + stride * 0],
    m.elements[columnIndex + stride * 1],
    m.elements[columnIndex + stride * 2]
  );
}

export function basis3ToMat3(
  xAxis: Vec3,
  yAxis: Vec3,
  zAxis: Vec3,
  result = new Mat3()
): Mat3 {
  return result.set([
    xAxis.x,
    yAxis.x,
    zAxis.x,
    xAxis.y,
    yAxis.y,
    zAxis.y,
    xAxis.z,
    yAxis.z,
    zAxis.z
  ]);
}

export function mat3ToBasis3(
  m: Mat3,
  xAxis = new Vec3(),
  yAxis = new Vec3(),
  zAxis = new Vec3()
): { xAxis: Vec3; yAxis: Vec3; zAxis: Vec3 } {
  mat3GetColumn3(m, 0, xAxis);
  mat3GetColumn3(m, 1, yAxis);
  mat3GetColumn3(m, 2, zAxis);
  return { xAxis, yAxis, zAxis };
}

export function mat3Equals(a: Mat3, b: Mat3, tolerance = EPSILON): boolean {
  for (let i = 0; i < Mat3.NUM_ELEMENTS; i++) {
    if (!equalsTolerance(a.elements[i], b.elements[i], tolerance)) return false;
  }
  return true;
}
export function mat3Add(a: Mat3, b: Mat3, result: Mat3 = new Mat3()): Mat3 {
  for (let i = 0; i < Mat3.NUM_ELEMENTS; i++) {
    result.elements[i] = a.elements[i] + b.elements[i];
  }
  return result;
}
export function mat3Subtract(
  a: Mat3,
  b: Mat3,
  result: Mat3 = new Mat3()
): Mat3 {
  for (let i = 0; i < Mat3.NUM_ELEMENTS; i++) {
    result.elements[i] = a.elements[i] - b.elements[i];
  }
  return result;
}
export function mat3MultiplyByScalar(
  a: Mat3,
  b: number,
  result: Mat3 = new Mat3()
): Mat3 {
  for (let i = 0; i < Mat3.NUM_ELEMENTS; i++) {
    result.elements[i] = a.elements[i] * b;
  }
  return result;
}
export function mat3Negate(a: Mat3, result: Mat3 = new Mat3()): Mat3 {
  for (let i = 0; i < Mat3.NUM_ELEMENTS; i++) {
    result.elements[i] = -a.elements[i];
  }
  return result;
}

export function mat3Multiply(a: Mat3, b: Mat3, result = new Mat3()): Mat3 {
  const ae = a.elements;
  const be = b.elements;
  const te = result.elements;

  const a11 = ae[0],
    a12 = ae[3],
    a13 = ae[6];
  const a21 = ae[1],
    a22 = ae[4],
    a23 = ae[7];
  const a31 = ae[2],
    a32 = ae[5],
    a33 = ae[8];

  const b11 = be[0],
    b12 = be[3],
    b13 = be[6];
  const b21 = be[1],
    b22 = be[4],
    b23 = be[7];
  const b31 = be[2],
    b32 = be[5],
    b33 = be[8];

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

export function mat3Determinant(m: Mat3): number {
  const me = m.elements;

  const a = me[0],
    b = me[1],
    c = me[2],
    d = me[3],
    e = me[4],
    f = me[5],
    g = me[6],
    h = me[7],
    i = me[8];

  return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
}

export function mat3Trace(m: Mat3): number {
  const me = m.elements;
  return me[0] + me[4] + me[8];
}

export function mat3Transpose(m: Mat3, result = new Mat3()): Mat3 {
  const me = m.elements;
  const te = result.elements;

  te[0] = me[0];
  te[4] = me[4];
  te[8] = me[8];

  te[1] = me[3];
  te[3] = me[1];

  te[2] = me[6];
  te[6] = me[2];

  te[5] = me[7];
  te[7] = me[5];

  return result;
}

export function mat3Inverse(m: Mat3, result = new Mat3()): Mat3 {
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

export function mat3Mix(
  a: Mat3,
  b: Mat3,
  t: number,
  result = new Mat3()
): Mat3 {
  const s = 1 - t;
  for (let i = 0; i < Mat3.NUM_ELEMENTS; i++) {
    result.elements[i] = a.elements[i] * s + b.elements[i] * t;
  }
  return result;
}
export function mat3FromArray(
  array: Float32Array | number[],
  offset = 0,
  result: Mat3 = new Mat3()
): Mat3 {
  for (let i = 0; i < Mat3.NUM_ELEMENTS; i++) {
    result.elements[i] = array[offset + i];
  }
  return result;
}
export function mat3ToArray(
  a: Mat3,
  array: Float32Array | number[],
  offset = 0
): void {
  for (let i = 0; i < Mat3.NUM_ELEMENTS; i++) {
    array[offset + i] = a.elements[i];
  }
}

export function mat3ToString(a: Mat3): string {
  return toSafeString(a.elements);
}
export function mat3Parse(text: string, result = new Mat3()): Mat3 {
  return mat3FromArray(parseSafeFloats(text), 0, result);
}

export function mat3TransformPoint3(
  m: Mat3,
  v: Vec3,
  result = new Vec3()
): Vec3 {
  const { x, y, z } = v;
  const e = m.elements;

  return result.set(
    e[0] * x + e[3] * y + e[6] * z,
    e[1] * x + e[4] * y + e[7] * z,
    e[2] * x + e[5] * y + e[8] * z
  );
}

export function quatToMat3(q: Vec4, result = new Mat3()): Mat3 {
  const { x, y, z, w } = q;

  const x2 = x + x;
  const y2 = y + y;
  const z2 = z + z;
  const xx = x * x2;
  const xy = x * y2;
  const xz = x * z2;
  const yy = y * y2;
  const yz = y * z2;
  const zz = z * z2;
  const wx = w * x2;
  const wy = w * y2;
  const wz = w * z2;

  return result.set([
    1 - (yy + zz),
    xy - wz,
    xz + wy,
    xy + wz,
    1 - (xx + zz),
    yz - wx,
    xz - wy,
    yz + wx,
    1 - (xx + yy)
  ]);
}

export function scale2ToMat3(s: Vec2, result = new Mat3()): Mat3 {
  return result.set([s.x, 0, 0, 0, s.y, 0, 0, 0, 1]);
}
// from gl-matrix
export function mat3ToScale2(m: Mat4, result = new Vec2()): Vec2 {
  const mat = m.elements;
  const m11 = mat[0];
  const m12 = mat[1];
  const m21 = mat[3];
  const m22 = mat[4];

  return result.set(
    Math.sqrt(m11 * m11 + m12 * m12),
    Math.sqrt(m21 * m21 + m22 * m22)
  );
}

export function translation2ToMat3(t: Vec2, result = new Mat3()): Mat3 {
  return result.set([1, 0, t.x, 0, 1, t.y, 0, 0, 1]);
}
export function mat3ToTranslation2(m: Mat3, result = new Vec2()): Vec2 {
  return result.set(m.elements[2], m.elements[5]);
}

export function scale3ToMat3(s: Vec3, result = new Mat3()): Mat3 {
  return result.set([s.x, 0, 0, 0, s.y, 0, 0, 0, s.z]);
}
// from gl-matrix
export function mat3ToScale3(m: Mat4, result = new Vec3()): Vec3 {
  const me = m.elements;
  const m11 = me[0];
  const m12 = me[1];
  const m13 = me[2];
  const m21 = me[3];
  const m22 = me[4];
  const m23 = me[5];
  const m31 = me[6];
  const m32 = me[7];
  const m33 = me[8];

  return result.set(
    Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13),
    Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23),
    Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33)
  );
}
export function mat4ToMat3(a: Mat4, result = new Mat3()): Mat3 {
  const ae = a.elements;
  return result.set([
    ae[0],
    ae[1],
    ae[2],
    ae[4],
    ae[5],
    ae[6],
    ae[8],
    ae[9],
    ae[10]
  ]);
}

export function makeMat3Concatenation(
  a: Mat3,
  b: Mat3,
  result = new Mat3()
): Mat3 {
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

export function makeMat3Transpose(m: Mat3, result = new Mat3()): Mat3 {
  let tmp;
  const me = m.clone(result).elements;

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

export function makeMat3Inverse(m: Mat3, result = new Mat3()): Mat3 {
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

export function angleXToMat3(angle: number, result = new Mat3()): Mat3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return result.set([c, -s, 0, s, c, 0, 0, 0, 1]);
}

export function composeMat3(
  translation: Vec2,
  rotation: number,
  scale: Vec2,
  result = new Mat3()
): Mat3 {
  const te = result.elements;

  const c = Math.cos(rotation);
  const s = Math.sin(rotation);

  te[0] = c * scale.x;
  te[1] = -s * scale.y;
  te[2] = 0;

  te[3] = s * scale.x;
  te[4] = c * scale.y;
  te[5] = 0;

  te[6] = translation.x;
  te[7] = translation.y;
  te[8] = 1;

  return result;
}

export function decomposeMat3(
  m: Mat3,
  translation = new Vec2(),
  rotation = 0,
  scale = new Vec2()
): { translation: Vec2; rotation: number; scale: Vec2 } {
  const te = m.elements;

  let sx = vec2Length(new Vec2(te[0], te[1]));
  const sy = vec2Length(new Vec2(te[3], te[4]));

  // if determine is negative, we need to invert one scale
  const det = mat3Determinant(m);
  if (det < 0) {
    sx = -sx;
  }

  translation.x = te[6];
  translation.y = te[7];

  rotation = Math.atan2(-te[1] / sy, te[4] / sy);

  scale.x = sx;
  scale.y = sy;

  return { translation, rotation, scale };
}
