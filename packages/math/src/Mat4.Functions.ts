import { Euler3, EulerOrder3 } from './Euler3.js';
import {
  degToRad,
  delta,
  EPSILON,
  equalsTolerance,
  parseSafeFloats,
  toSafeString
} from './Functions.js';
import { quatToMat3 } from './Mat3.Functions.js';
import { Mat3 } from './Mat3.js';
import { Mat4 } from './Mat4.js';
import { mat4ToQuat } from './Quat.Functions.js';
import { Quat } from './Quat.js';
import { Vec2 } from './Vec2.js';
import {
  vec3Cross,
  vec3Length,
  vec3MultiplyByScalar,
  vec3Normalize,
  vec3Subtract
} from './Vec3.Functions.js';
import { Vec3 } from './Vec3.js';

export function mat4Delta(a: Mat4, b: Mat4): number {
  let deltaSum = 0;
  for (let i = 0; i < Mat4.NUM_COMPONENTS; i++) {
    deltaSum = delta(a.elements[i], b.elements[i]);
  }
  return deltaSum;
}

export function mat4Zero(result = new Mat4()): Mat4 {
  return result.set([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

export function mat4Identity(result = new Mat4()): Mat4 {
  return result.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

export function mat4SetColumn3(
  m: Mat4,
  index: number,
  v: Vec3,
  result = new Mat4()
): Mat4 {
  const re = result.set(m.elements).elements;
  const base = Number(index) * Mat4.NUM_ROWS;
  re[base + 0] = v.x;
  re[base + 1] = v.y;
  re[base + 2] = v.z;
  return result;
}

export function mat4GetColumn3(
  m: Mat4,
  index: number,
  result = new Vec3()
): Vec3 {
  const base = index * Mat4.NUM_ROWS;
  return result.set(
    m.elements[base + 0],
    m.elements[base + 1],
    m.elements[base + 2]
  );
}

export function mat4SetRow3(
  m: Mat4,
  index: number,
  v: Vec3,
  result = new Mat4()
): Mat4 {
  const re = result.set(m.elements).elements;
  const stride = Mat4.NUM_COLUMNS;
  re[index + stride * 0] = v.x;
  re[index + stride * 1] = v.y;
  re[index + stride * 2] = v.z;
  return result;
}

export function mat4GetRow3(m: Mat3, index: number, result = new Vec3()): Vec3 {
  const stride = Mat4.NUM_COLUMNS;
  return result.set(
    m.elements[index + stride * 0],
    m.elements[index + stride * 1],
    m.elements[index + stride * 2]
  );
}

export function basis3ToMat4(
  xAxis: Vec3,
  yAxis: Vec3,
  zAxis: Vec3,
  result = new Mat4()
): Mat4 {
  return result.set([
    xAxis.x,
    xAxis.y,
    xAxis.z,
    0,
    yAxis.x,
    yAxis.y,
    yAxis.z,
    0,
    zAxis.x,
    zAxis.y,
    zAxis.z,
    0,
    0,
    0,
    0,
    1
  ]);
}

export function mat4ToBasis3(
  m: Mat4,
  xAxis = new Vec3(),
  yAxis = new Vec3(),
  zAxis = new Vec3()
): { xAxis: Vec3; yAxis: Vec3; zAxis: Vec3 } {
  mat4GetColumn3(m, 0, xAxis);
  mat4GetColumn3(m, 1, yAxis);
  mat4GetColumn3(m, 2, zAxis);
  return { xAxis, yAxis, zAxis };
}

export function mat4Equals(
  a: Mat4,
  b: Mat4,
  tolerance: number = EPSILON
): boolean {
  for (let i = 0; i < Mat4.NUM_COMPONENTS; i++) {
    if (!equalsTolerance(a.elements[i], b.elements[i], tolerance)) return false;
  }
  return true;
}

export function mat4Add(a: Mat4, b: Mat4, result: Mat4 = new Mat4()): Mat4 {
  for (let i = 0; i < Mat4.NUM_COMPONENTS; i++) {
    result.elements[i] = a.elements[i] + b.elements[i];
  }
  return result;
}
export function mat4Subtract(
  a: Mat4,
  b: Mat4,
  result: Mat4 = new Mat4()
): Mat4 {
  for (let i = 0; i < Mat4.NUM_COMPONENTS; i++) {
    result.elements[i] = a.elements[i] - b.elements[i];
  }
  return result;
}

export function mat4MultiplyByScalar(
  a: Mat4,
  b: number,
  result: Mat4 = new Mat4()
): Mat4 {
  for (let i = 0; i < Mat4.NUM_COMPONENTS; i++) {
    result.elements[i] = a.elements[i] * b;
  }
  return result;
}

export function mat4Negate(a: Mat4, result: Mat4 = new Mat4()): Mat4 {
  for (let i = 0; i < Mat4.NUM_COMPONENTS; i++) {
    result.elements[i] = -a.elements[i];
  }
  return result;
}

export function mat4Multiply(a: Mat4, b: Mat4, result = new Mat4()): Mat4 {
  const ae = a.elements;
  const be = b.elements;
  const te = result.elements;

  const a11 = ae[0],
    a12 = ae[4],
    a13 = ae[8],
    a14 = ae[12];
  const a21 = ae[1],
    a22 = ae[5],
    a23 = ae[9],
    a24 = ae[13];
  const a31 = ae[2],
    a32 = ae[6],
    a33 = ae[10],
    a34 = ae[14];
  const a41 = ae[3],
    a42 = ae[7],
    a43 = ae[11],
    a44 = ae[15];

  const b11 = be[0],
    b12 = be[4],
    b13 = be[8],
    b14 = be[12];
  const b21 = be[1],
    b22 = be[5],
    b23 = be[9],
    b24 = be[13];
  const b31 = be[2],
    b32 = be[6],
    b33 = be[10],
    b34 = be[14];
  const b41 = be[3],
    b42 = be[7],
    b43 = be[11],
    b44 = be[15];

  // TODO: Replace with set(...)
  te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
  te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
  te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
  te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

  te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
  te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
  te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
  te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

  te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
  te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
  te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
  te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

  te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
  te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
  te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
  te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

  return result;
}

export function mat4Determinant(m: Mat4): number {
  // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
  const me = m.elements,
    n11 = me[0],
    n21 = me[1],
    n31 = me[2],
    n41 = me[3],
    n12 = me[4],
    n22 = me[5],
    n32 = me[6],
    n42 = me[7],
    n13 = me[8],
    n23 = me[9],
    n33 = me[10],
    n43 = me[11],
    n14 = me[12],
    n24 = me[13],
    n34 = me[14],
    n44 = me[15],
    t11 =
      n23 * n34 * n42 -
      n24 * n33 * n42 +
      n24 * n32 * n43 -
      n22 * n34 * n43 -
      n23 * n32 * n44 +
      n22 * n33 * n44,
    t12 =
      n14 * n33 * n42 -
      n13 * n34 * n42 -
      n14 * n32 * n43 +
      n12 * n34 * n43 +
      n13 * n32 * n44 -
      n12 * n33 * n44,
    t13 =
      n13 * n24 * n42 -
      n14 * n23 * n42 +
      n14 * n22 * n43 -
      n12 * n24 * n43 -
      n13 * n22 * n44 +
      n12 * n23 * n44,
    t14 =
      n14 * n23 * n32 -
      n13 * n24 * n32 -
      n14 * n22 * n33 +
      n12 * n24 * n33 +
      n13 * n22 * n34 -
      n12 * n23 * n34;

  return n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
}
export function mat4Adjoint(m: Mat4, result = new Mat4()): Mat4 {
  // from gl-matrix
  const a = m.elements;
  const out = result.elements;
  const a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a03 = a[3];
  const a10 = a[4],
    a11 = a[5],
    a12 = a[6],
    a13 = a[7];
  const a20 = a[8],
    a21 = a[9],
    a22 = a[10],
    a23 = a[11];
  const a30 = a[12],
    a31 = a[13],
    a32 = a[14],
    a33 = a[15];

  const b00 = a00 * a11 - a01 * a10;
  const b01 = a00 * a12 - a02 * a10;
  const b02 = a00 * a13 - a03 * a10;
  const b03 = a01 * a12 - a02 * a11;
  const b04 = a01 * a13 - a03 * a11;
  const b05 = a02 * a13 - a03 * a12;
  const b06 = a20 * a31 - a21 * a30;
  const b07 = a20 * a32 - a22 * a30;
  const b08 = a20 * a33 - a23 * a30;
  const b09 = a21 * a32 - a22 * a31;
  const b10 = a21 * a33 - a23 * a31;
  const b11 = a22 * a33 - a23 * a32;

  out[0] = a11 * b11 - a12 * b10 + a13 * b09;
  out[1] = a02 * b10 - a01 * b11 - a03 * b09;
  out[2] = a31 * b05 - a32 * b04 + a33 * b03;
  out[3] = a22 * b04 - a21 * b05 - a23 * b03;
  out[4] = a12 * b08 - a10 * b11 - a13 * b07;
  out[5] = a00 * b11 - a02 * b08 + a03 * b07;
  out[6] = a32 * b02 - a30 * b05 - a33 * b01;
  out[7] = a20 * b05 - a22 * b02 + a23 * b01;
  out[8] = a10 * b10 - a11 * b08 + a13 * b06;
  out[9] = a01 * b08 - a00 * b10 - a03 * b06;
  out[10] = a30 * b04 - a31 * b02 + a33 * b00;
  out[11] = a21 * b02 - a20 * b04 - a23 * b00;
  out[12] = a11 * b07 - a10 * b09 - a12 * b06;
  out[13] = a00 * b09 - a01 * b07 + a02 * b06;
  out[14] = a31 * b01 - a30 * b03 - a32 * b00;
  out[15] = a20 * b03 - a21 * b01 + a22 * b00;
  return result;
}

export function mat4Transpose(m: Mat4, result = new Mat4()): Mat4 {
  const re = m.clone(result).elements;
  let tmp;

  // TODO: replace this with just reading from me and setting re, no need for a temporary
  tmp = re[1];
  re[1] = re[4];
  re[4] = tmp;
  tmp = re[2];
  re[2] = re[8];
  re[8] = tmp;
  tmp = re[6];
  re[6] = re[9];
  re[9] = tmp;

  tmp = re[3];
  re[3] = re[12];
  re[12] = tmp;
  tmp = re[7];
  re[7] = re[13];
  re[13] = tmp;
  tmp = re[11];
  re[11] = re[14];
  re[14] = tmp;

  return result;
}

export function mat4Inverse(m: Mat4, result = new Mat4()): Mat4 {
  // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
  const me = m.elements,
    n11 = me[0],
    n21 = me[1],
    n31 = me[2],
    n41 = me[3],
    n12 = me[4],
    n22 = me[5],
    n32 = me[6],
    n42 = me[7],
    n13 = me[8],
    n23 = me[9],
    n33 = me[10],
    n43 = me[11],
    n14 = me[12],
    n24 = me[13],
    n34 = me[14],
    n44 = me[15],
    t11 =
      n23 * n34 * n42 -
      n24 * n33 * n42 +
      n24 * n32 * n43 -
      n22 * n34 * n43 -
      n23 * n32 * n44 +
      n22 * n33 * n44,
    t12 =
      n14 * n33 * n42 -
      n13 * n34 * n42 -
      n14 * n32 * n43 +
      n12 * n34 * n43 +
      n13 * n32 * n44 -
      n12 * n33 * n44,
    t13 =
      n13 * n24 * n42 -
      n14 * n23 * n42 +
      n14 * n22 * n43 -
      n12 * n24 * n43 -
      n13 * n22 * n44 +
      n12 * n23 * n44,
    t14 =
      n14 * n23 * n32 -
      n13 * n24 * n32 -
      n14 * n22 * n33 +
      n12 * n24 * n33 +
      n13 * n22 * n34 -
      n12 * n23 * n34;

  const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

  if (det === 0) {
    throw new Error('can not invert degenerate matrix');
  }

  const detInv = 1 / det;

  // TODO: replace with a set
  const re = result.elements;
  re[0] = t11 * detInv;
  re[1] =
    (n24 * n33 * n41 -
      n23 * n34 * n41 -
      n24 * n31 * n43 +
      n21 * n34 * n43 +
      n23 * n31 * n44 -
      n21 * n33 * n44) *
    detInv;
  re[2] =
    (n22 * n34 * n41 -
      n24 * n32 * n41 +
      n24 * n31 * n42 -
      n21 * n34 * n42 -
      n22 * n31 * n44 +
      n21 * n32 * n44) *
    detInv;
  re[3] =
    (n23 * n32 * n41 -
      n22 * n33 * n41 -
      n23 * n31 * n42 +
      n21 * n33 * n42 +
      n22 * n31 * n43 -
      n21 * n32 * n43) *
    detInv;

  re[4] = t12 * detInv;
  re[5] =
    (n13 * n34 * n41 -
      n14 * n33 * n41 +
      n14 * n31 * n43 -
      n11 * n34 * n43 -
      n13 * n31 * n44 +
      n11 * n33 * n44) *
    detInv;
  re[6] =
    (n14 * n32 * n41 -
      n12 * n34 * n41 -
      n14 * n31 * n42 +
      n11 * n34 * n42 +
      n12 * n31 * n44 -
      n11 * n32 * n44) *
    detInv;
  re[7] =
    (n12 * n33 * n41 -
      n13 * n32 * n41 +
      n13 * n31 * n42 -
      n11 * n33 * n42 -
      n12 * n31 * n43 +
      n11 * n32 * n43) *
    detInv;

  re[8] = t13 * detInv;
  re[9] =
    (n14 * n23 * n41 -
      n13 * n24 * n41 -
      n14 * n21 * n43 +
      n11 * n24 * n43 +
      n13 * n21 * n44 -
      n11 * n23 * n44) *
    detInv;
  re[10] =
    (n12 * n24 * n41 -
      n14 * n22 * n41 +
      n14 * n21 * n42 -
      n11 * n24 * n42 -
      n12 * n21 * n44 +
      n11 * n22 * n44) *
    detInv;
  re[11] =
    (n13 * n22 * n41 -
      n12 * n23 * n41 -
      n13 * n21 * n42 +
      n11 * n23 * n42 +
      n12 * n21 * n43 -
      n11 * n22 * n43) *
    detInv;

  re[12] = t14 * detInv;
  re[13] =
    (n13 * n24 * n31 -
      n14 * n23 * n31 +
      n14 * n21 * n33 -
      n11 * n24 * n33 -
      n13 * n21 * n34 +
      n11 * n23 * n34) *
    detInv;
  re[14] =
    (n14 * n22 * n31 -
      n12 * n24 * n31 -
      n14 * n21 * n32 +
      n11 * n24 * n32 +
      n12 * n21 * n34 -
      n11 * n22 * n34) *
    detInv;
  re[15] =
    (n12 * n23 * n31 -
      n13 * n22 * n31 +
      n13 * n21 * n32 -
      n11 * n23 * n32 -
      n12 * n21 * n33 +
      n11 * n22 * n33) *
    detInv;

  return result;
}

export function mat4Mix(
  a: Mat4,
  b: Mat4,
  t: number,
  result = new Mat4()
): Mat4 {
  const s = 1 - t;
  for (let i = 0; i < Mat4.NUM_COMPONENTS; i++) {
    result.elements[i] = a.elements[i] * s + b.elements[i] * t;
  }
  return result;
}

export function arrayToMat4(
  array: Float32Array | number[],
  offset = 0,
  result: Mat4 = new Mat4()
): Mat4 {
  for (let i = 0; i < Mat4.NUM_COMPONENTS; i++) {
    result.elements[i] = array[offset + i];
  }
  return result;
}

export function mat4ToArray(
  a: Mat4,
  array: Float32Array | number[],
  offset = 0
): void {
  for (let i = 0; i < Mat4.NUM_COMPONENTS; i++) {
    array[offset + i] = a.elements[i];
  }
}

export function mat4ToString(a: Mat4): string {
  return toSafeString(a.elements);
}

export function mat4Parse(text: string, result = new Mat4()): Mat4 {
  return arrayToMat4(parseSafeFloats(text), 0, result);
}

export function mat3ToMat4(a: Mat3, result = new Mat4()): Mat4 {
  const ae = a.elements;
  return result.set([
    ae[0],
    ae[1],
    ae[2],
    0,
    ae[3],
    ae[4],
    ae[5],
    0,
    ae[6],
    ae[7],
    ae[8],
    0,
    0,
    0,
    0,
    1
  ]);
}

export function quatToMat4(q: Quat, result = new Mat4()): Mat4 {
  return mat3ToMat4(quatToMat3(q), result);
}

export function scale3ToMat4(s: Vec3, result = new Mat4()): Mat4 {
  return result.set([s.x, 0, 0, 0, 0, s.y, 0, 0, 0, 0, s.z, 0, 0, 0, 0, 1]);
}
// from gl-matrix
export function mat4ToScale3(m: Mat4, result = new Vec3()): Vec3 {
  const mat = m.elements;
  const m11 = mat[0];
  const m12 = mat[1];
  const m13 = mat[2];
  const m21 = mat[4];
  const m22 = mat[5];
  const m23 = mat[6];
  const m31 = mat[8];
  const m32 = mat[9];
  const m33 = mat[10];

  return result.set(
    Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13),
    Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23),
    Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33)
  );
}

export function mat4ToMaxAxisScale(m: Mat4): number {
  const scale = mat4ToScale3(m);
  return Math.max(Math.abs(scale.x), Math.abs(scale.y), Math.abs(scale.z));
}

export function translation3ToMat4(t: Vec3, result = new Mat4()): Mat4 {
  return result.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t.x, t.y, t.z, 1]);
}
export function mat4ToTranslation3(m: Mat4, result = new Vec3()): Vec3 {
  const me = m.elements;
  return result.set(me[12], me[13], me[14]);
}
export function mat4Translate(m: Mat4, t: Vec3, result = new Mat4()): Mat4 {
  return mat4Multiply(m, translation3ToMat4(t), result);
}
export function mat4Scale(m: Mat4, s: Vec3, result = new Mat4()): Mat4 {
  return mat4Multiply(m, scale3ToMat4(s), result);
}
export function mat4RotateByQuat(m: Mat4, q: Quat, result = new Mat4()): Mat4 {
  return mat4Multiply(m, quatToMat4(q), result);
}
export function mat4RotateByEuler(
  m: Mat4,
  e: Euler3,
  result = new Mat4()
): Mat4 {
  return mat4Multiply(m, euler3ToMat4(e), result);
}

export function mat4Perspective(
  left: number,
  right: number,
  top: number,
  bottom: number,
  near: number,
  far: number,
  result = new Mat4()
): Mat4 {
  const x = (2 * near) / (right - left);
  const y = (2 * near) / (top - bottom);

  const a = (right + left) / (right - left);
  const b = (top + bottom) / (top - bottom);
  const c = -(far + near) / (far - near);
  const d = (-2 * far * near) / (far - near);

  return result.set([x, 0, 0, 0, 0, y, 0, 0, a, b, c, -1, 0, 0, d, 0]);
}

export function mat4PerspectiveFov(
  verticalFovDegrees: number,
  near: number,
  far: number,
  zoom: number,
  aspectRatio: number,
  result = new Mat4()
): Mat4 {
  const height = (2 * near * Math.tan(degToRad(verticalFovDegrees))) / zoom;
  const width = height * aspectRatio;

  // NOTE: OpenGL screen coordinates are -bottomt to +top, -left to +right.

  const right = width * 0.5;
  const left = right - width;

  const top = height * 0.5;
  const bottom = top - height;

  return mat4Perspective(left, right, top, bottom, near, far, result);
}

export function mat4PerspectiveFovSubview(
  verticalFovDegrees: number,
  near: number,
  far: number,
  zoom: number,
  aspectRatio: number,
  relativeOffset: Vec2,
  relativeView: Vec2,
  result = new Mat4()
): Mat4 {
  let height = (2 * near * Math.tan(degToRad(verticalFovDegrees))) / zoom;
  let width = height * aspectRatio;

  // NOTE: OpenGL screen coordinates are -bottomt to +top, -left to +right.

  let left = -width * 0.5;
  let top = height * 0.5;

  left += relativeOffset.x * relativeView.x;
  top -= relativeOffset.y * relativeView.y;
  width *= relativeView.x;
  height *= relativeView.y;

  const right = left + width;
  const bottom = top - height;

  return mat4Perspective(left, right, top, bottom, near, far, result);
}

export function mat4Trace(m: Mat4): number {
  const me = m.elements;
  return me[0] + me[5] + me[10] + me[15];
}

// TODO: Replace with a Box3?
export function mat4Orthographic(
  left: number,
  right: number,
  top: number,
  bottom: number,
  near: number,
  far: number,
  result = new Mat4()
): Mat4 {
  const w = 1 / (right - left);
  const h = 1 / (top - bottom);
  const p = 1 / (far - near);

  const x = (right + left) * w;
  const y = (top + bottom) * h;
  const z = (far + near) * p;

  return result.set([
    2 * w,
    0,
    0,
    0,

    0,
    2 * h,
    0,
    0,

    0,
    0,
    -2 * p,
    0,
    -x,
    -y,
    -z,
    1
  ]);
}

export function mat4OrthographicSimple(
  height: number,
  center: Vec2,
  near: number,
  far: number,
  zoom: number,
  aspectRatio = 1,
  result = new Mat4()
): Mat4 {
  height /= zoom;
  const width = height * aspectRatio;

  const left = -width * 0.5 + center.x;
  const right = left + width;

  const top = -height * 0.5 + center.y;
  const bottom = top + height;

  return mat4Orthographic(left, right, top, bottom, near, far, result);
}

export function mat4LookAt(
  eye: Vec3,
  target: Vec3,
  up: Vec3,
  result = new Mat4()
): Mat4 {
  const te = result.elements;

  const look = vec3Subtract(eye, target);

  const lookLength = vec3Length(look);
  if (lookLength === 0) {
    look.z = 1;
  } else {
    vec3MultiplyByScalar(look, 1 / lookLength, look);
  }

  const right = vec3Cross(up, look);

  const rightLength = vec3Length(right);
  if (rightLength === 0) {
    // up and z are parallel

    if (Math.abs(up.z) === 1) {
      up.x += 0.0001;
    } else {
      up.z += 0.0001;
    }

    vec3Normalize(up, up);
    vec3Cross(right, up, right);
  } else {
    vec3MultiplyByScalar(right, 1 / rightLength, right);
  }

  const up2 = vec3Cross(look, right);

  te[0] = right.x;
  te[4] = up2.x;
  te[8] = look.x;
  te[1] = right.y;
  te[5] = up2.y;
  te[9] = look.y;
  te[2] = right.z;
  te[6] = up2.z;
  te[10] = look.z;

  return result;
}

export function angleAxisToMat4(
  axis: Vec3,
  angle: number,
  result = new Mat4()
): Mat4 {
  // Based on http://www.gamedev.net/reference/articles/article1199.asp

  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const t = 1 - c;
  const { x, y, z } = axis;
  const tx = t * x;
  const ty = t * y;

  return result.set([
    tx * x + c,
    tx * y - s * z,
    tx * z + s * y,
    0,
    tx * y + s * z,
    ty * y + c,
    ty * z - s * x,
    0,
    tx * z - s * y,
    ty * z + s * x,
    t * z * z + c,
    0,
    0,
    0,
    0,
    1
  ]);
}

export function euler3ToMat4(euler: Euler3, result = new Mat4()): Mat4 {
  const te = result.elements;

  const { x, y, z, order } = euler;
  const a = Math.cos(x);
  const b = Math.sin(x);
  const c = Math.cos(y);
  const d = Math.sin(y);
  const e = Math.cos(z);
  const f = Math.sin(z);

  // TODO: Replace smart code that compacts all of these orders into one
  switch (order) {
    case EulerOrder3.XYZ: {
      const ae = a * e;
      const af = a * f;
      const be = b * e;
      const bf = b * f;

      te[0] = c * e;
      te[4] = -c * f;
      te[8] = d;

      te[1] = af + be * d;
      te[5] = ae - bf * d;
      te[9] = -b * c;

      te[2] = bf - ae * d;
      te[6] = be + af * d;
      te[10] = a * c;

      break;
    }
    case EulerOrder3.YXZ: {
      const ce = c * e;
      const cf = c * f;
      const de = d * e;
      const df = d * f;

      te[0] = ce + df * b;
      te[4] = de * b - cf;
      te[8] = a * d;

      te[1] = a * f;
      te[5] = a * e;
      te[9] = -b;

      te[2] = cf * b - de;
      te[6] = df + ce * b;
      te[10] = a * c;

      break;
    }
    case EulerOrder3.ZXY: {
      const ce = c * e;
      const cf = c * f;
      const de = d * e;
      const df = d * f;

      te[0] = ce - df * b;
      te[4] = -a * f;
      te[8] = de + cf * b;

      te[1] = cf + de * b;
      te[5] = a * e;
      te[9] = df - ce * b;

      te[2] = -a * d;
      te[6] = b;
      te[10] = a * c;

      break;
    }
    case EulerOrder3.ZYX: {
      const ae = a * e;
      const af = a * f;
      const be = b * e;
      const bf = b * f;

      te[0] = c * e;
      te[4] = be * d - af;
      te[8] = ae * d + bf;

      te[1] = c * f;
      te[5] = bf * d + ae;
      te[9] = af * d - be;

      te[2] = -d;
      te[6] = b * c;
      te[10] = a * c;

      break;
    }
    case EulerOrder3.YZX: {
      const ac = a * c;
      const ad = a * d;
      const bc = b * c;
      const bd = b * d;

      te[0] = c * e;
      te[4] = bd - ac * f;
      te[8] = bc * f + ad;

      te[1] = f;
      te[5] = a * e;
      te[9] = -b * e;

      te[2] = -d * e;
      te[6] = ad * f + bc;
      te[10] = ac - bd * f;

      break;
    }
    case EulerOrder3.XZY: {
      const ac = a * c;
      const ad = a * d;
      const bc = b * c;
      const bd = b * d;

      te[0] = c * e;
      te[4] = -f;
      te[8] = d * e;

      te[1] = ac * f + bd;
      te[5] = a * e;
      te[9] = ad * f - bc;

      te[2] = bc * f - ad;
      te[6] = b * e;
      te[10] = bd * f + ac;

      break;
    }
    // No default
  }

  // bottom row
  te[3] = 0;
  te[7] = 0;
  te[11] = 0;

  // last column
  te[12] = 0;
  te[13] = 0;
  te[14] = 0;
  te[15] = 1;

  return result;
}

export function shearToMat4(
  x: number,
  y: number,
  z: number,
  result = new Mat4()
): Mat4 {
  return result.set([1, y, z, 0, x, 1, z, 0, x, y, 1, 0, 0, 0, 0, 1]);
}

export function mat4Compose(
  translation: Vec3,
  rotation: Quat,
  scale: Vec3,
  result = new Mat4()
): Mat4 {
  const { x, y, z, w } = rotation;
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

  const sx = scale.x;
  const sy = scale.y;
  const sz = scale.z;

  return result.set([
    (1 - (yy + zz)) * sx,
    (xy + wz) * sx,
    (xz - wy) * sx,
    0,
    (xy - wz) * sy,
    (1 - (xx + zz)) * sy,
    (yz + wx) * sy,
    0,
    (xz + wy) * sz,
    (yz - wx) * sz,
    (1 - (xx + yy)) * sz,
    0,
    translation.x,
    translation.y,
    translation.z,
    1
  ]);
}

export function mat4Decompose(
  m: Mat4,
  translation = new Vec3(),
  rotation = new Quat(),
  scale = new Vec3()
): { translation: Vec3; rotation: Quat; scale: Vec3 } {
  const te = m.elements;

  let sx = vec3Length(new Vec3(te[0], te[1], te[2]));
  const sy = vec3Length(new Vec3(te[4], te[5], te[6]));
  const sz = vec3Length(new Vec3(te[8], te[9], te[10]));

  // if determine is negative, we need to invert one scale
  if (mat4Determinant(m) < 0) {
    sx = -sx;
  }

  translation.x = te[12];
  translation.y = te[13];
  translation.z = te[14];

  // scale the rotation part
  const m2 = m.clone();

  const invSX = 1 / sx;
  const invSY = 1 / sy;
  const invSZ = 1 / sz;

  // TODO: replace with me
  m2.elements[0] *= invSX;
  m2.elements[1] *= invSX;
  m2.elements[2] *= invSX;

  m2.elements[4] *= invSY;
  m2.elements[5] *= invSY;
  m2.elements[6] *= invSY;

  m2.elements[8] *= invSZ;
  m2.elements[9] *= invSZ;
  m2.elements[10] *= invSZ;

  mat4ToQuat(m2, rotation);

  scale.x = sx;
  scale.y = sy;
  scale.z = sz;

  return { translation, rotation, scale };
}
