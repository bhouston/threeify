import { Euler3, EulerOrder3 } from './Euler3.js';
import { Matrix4 } from './Matrix4.js';
import { makeQuaternionFromRotationMatrix4 } from './Quaternion.Functions.js';
import { Quaternion } from './Quaternion.js';
import { Vector2 } from './Vector2.js';
import { Vector3 } from './Vector3.js';

export function makeMatrix4Concatenation(
  a: Matrix4,
  b: Matrix4,
  result = new Matrix4()
): Matrix4 {
  const ae = a.elements;
  const be = b.elements;
  const te = result.elements;

  const a11 = ae[0];
  const a12 = ae[4];
  const a13 = ae[8];
  const a14 = ae[12];
  const a21 = ae[1];
  const a22 = ae[5];
  const a23 = ae[9];
  const a24 = ae[13];
  const a31 = ae[2];
  const a32 = ae[6];
  const a33 = ae[10];
  const a34 = ae[14];
  const a41 = ae[3];
  const a42 = ae[7];
  const a43 = ae[11];
  const a44 = ae[15];

  const b11 = be[0];
  const b12 = be[4];
  const b13 = be[8];
  const b14 = be[12];
  const b21 = be[1];
  const b22 = be[5];
  const b23 = be[9];
  const b24 = be[13];
  const b31 = be[2];
  const b32 = be[6];
  const b33 = be[10];
  const b34 = be[14];
  const b41 = be[3];
  const b42 = be[7];
  const b43 = be[11];
  const b44 = be[15];

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

export function matrix4Determinant(m: Matrix4): number {
  // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
  const me = m.elements;
  const n11 = me[0];
  const n21 = me[1];
  const n31 = me[2];
  const n41 = me[3];
  const n12 = me[4];
  const n22 = me[5];
  const n32 = me[6];
  const n42 = me[7];
  const n13 = me[8];
  const n23 = me[9];
  const n33 = me[10];
  const n43 = me[11];
  const n14 = me[12];
  const n24 = me[13];
  const n34 = me[14];
  const n44 = me[15];
  const t11 =
    n23 * n34 * n42 -
    n24 * n33 * n42 +
    n24 * n32 * n43 -
    n22 * n34 * n43 -
    n23 * n32 * n44 +
    n22 * n33 * n44;
  const t12 =
    n14 * n33 * n42 -
    n13 * n34 * n42 -
    n14 * n32 * n43 +
    n12 * n34 * n43 +
    n13 * n32 * n44 -
    n12 * n33 * n44;
  const t13 =
    n13 * n24 * n42 -
    n14 * n23 * n42 +
    n14 * n22 * n43 -
    n12 * n24 * n43 -
    n13 * n22 * n44 +
    n12 * n23 * n44;
  const t14 =
    n14 * n23 * n32 -
    n13 * n24 * n32 -
    n14 * n22 * n33 +
    n12 * n24 * n33 +
    n13 * n22 * n34 -
    n12 * n23 * n34;

  return n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
}

export function makeMatrix4Transpose(
  m: Matrix4,
  result = new Matrix4()
): Matrix4 {
  const re = result.copy(m).elements;
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

export function makeMatrix4Inverse(
  m: Matrix4,
  result = new Matrix4()
): Matrix4 {
  // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
  const me = m.elements;
  const n11 = me[0];
  const n21 = me[1];
  const n31 = me[2];
  const n41 = me[3];
  const n12 = me[4];
  const n22 = me[5];
  const n32 = me[6];
  const n42 = me[7];
  const n13 = me[8];
  const n23 = me[9];
  const n33 = me[10];
  const n43 = me[11];
  const n14 = me[12];
  const n24 = me[13];
  const n34 = me[14];
  const n44 = me[15];
  const t11 =
    n23 * n34 * n42 -
    n24 * n33 * n42 +
    n24 * n32 * n43 -
    n22 * n34 * n43 -
    n23 * n32 * n44 +
    n22 * n33 * n44;
  const t12 =
    n14 * n33 * n42 -
    n13 * n34 * n42 -
    n14 * n32 * n43 +
    n12 * n34 * n43 +
    n13 * n32 * n44 -
    n12 * n33 * n44;
  const t13 =
    n13 * n24 * n42 -
    n14 * n23 * n42 +
    n14 * n22 * n43 -
    n12 * n24 * n43 -
    n13 * n22 * n44 +
    n12 * n23 * n44;
  const t14 =
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

export function makeMatrix4Translation(
  t: Vector3,
  result = new Matrix4()
): Matrix4 {
  return result.set(1, 0, 0, t.x, 0, 1, 0, t.y, 0, 0, 1, t.z, 0, 0, 0, 1);
}

export function makeMatrix4RotationFromAngleAxis(
  axis: Vector3,
  angle: number,
  result = new Matrix4()
): Matrix4 {
  // Based on http://www.gamedev.net/reference/articles/article1199.asp

  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const t = 1 - c;
  const { x } = axis;
  const { y } = axis;
  const { z } = axis;
  const tx = t * x;
  const ty = t * y;

  return result.set(
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
  );
}

export function makeMatrix4LookAt(
  eye: Vector3,
  target: Vector3,
  up: Vector3,
  result = new Matrix4()
): Matrix4 {
  const te = result.elements;

  const look = eye.clone().sub(target);

  const lookLength = look.length();
  if (lookLength === 0) {
    look.z = 1;
  } else {
    look.multiplyByScalar(1 / lookLength);
  }

  const right = up.clone().cross(look);

  const rightLength = right.length();
  if (rightLength === 0) {
    // up and z are parallel

    if (Math.abs(up.z) === 1) {
      up.x += 0.0001;
    } else {
      up.z += 0.0001;
    }

    up.normalize();
    right.cross(up);
  } else {
    right.multiplyByScalar(1 / rightLength);
  }

  const up2 = look.clone().cross(right);

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

export function makeMatrix4RotationFromEuler(
  euler: Euler3,
  result = new Matrix4()
): Matrix4 {
  const te = result.elements;

  const { x } = euler;
  const { y } = euler;
  const { z } = euler;
  const a = Math.cos(x);
  const b = Math.sin(x);
  const c = Math.cos(y);
  const d = Math.sin(y);
  const e = Math.cos(z);
  const f = Math.sin(z);

  // TODO: Replace smart code that compacts all of these orders into one
  switch (euler.order) {
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

export function makeMatrix4RotationFromQuaternion(
  q: Quaternion,
  result = new Matrix4()
): Matrix4 {
  return composeMatrix4(new Vector3(), q, new Vector3(1, 1, 1), result);
}

export function makeMatrix4Scale(s: Vector3, result = new Matrix4()): Matrix4 {
  return result.set(s.x, 0, 0, 0, 0, s.y, 0, 0, 0, 0, s.z, 0, 0, 0, 0, 1);
}

export function makeMatrix4Shear(
  x: number,
  y: number,
  z: number,
  result = new Matrix4()
): Matrix4 {
  return result.set(1, y, z, 0, x, 1, z, 0, x, y, 1, 0, 0, 0, 0, 1);
}

export function getMaxScaleOnAxis(m: Matrix4): number {
  const te = m.elements;

  const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
  const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
  const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

  return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
}

export function composeMatrix4(
  position: Vector3,
  rotation: Quaternion,
  scale: Vector3,
  result = new Matrix4()
): Matrix4 {
  const { x } = rotation;
  const { y } = rotation;
  const { z } = rotation;
  const { w } = rotation;
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

  return result.set(
    // TODO: Replace with set
    (1 - (yy + zz)) * sx,
    (xy - wz) * sy,
    (xz + wy) * sz,
    position.x,
    (xy + wz) * sx,
    (1 - (xx + zz)) * sy,
    (yz - wx) * sz,
    position.y,
    (xz - wy) * sx,
    (yz + wx) * sy,
    (1 - (xx + yy)) * sz,
    position.z,
    0,
    0,
    0,
    1
  );
}

export function decomposeMatrix4(
  m: Matrix4,
  position: Vector3,
  rotation: Quaternion,
  scale: Vector3
): Matrix4 {
  const te = m.elements;

  let sx = new Vector3(te[0], te[1], te[2]).length();
  const sy = new Vector3(te[4], te[5], te[6]).length();
  const sz = new Vector3(te[8], te[9], te[10]).length();

  // if determine is negative, we need to invert one scale
  if (matrix4Determinant(m) < 0) {
    sx = -sx;
  }

  position.x = te[12];
  position.y = te[13];
  position.z = te[14];

  // scale the rotation part
  const m2 = new Matrix4().copy(m);

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

  makeQuaternionFromRotationMatrix4(m2, rotation);

  scale.x = sx;
  scale.y = sy;
  scale.z = sz;

  return m;
}

// TODO: Replace with a Box2
export function makeMatrix4Perspective(
  left: number,
  right: number,
  top: number,
  bottom: number,
  near: number,
  far: number,
  result = new Matrix4()
): Matrix4 {
  const x = (2 * near) / (right - left);
  const y = (2 * near) / (top - bottom);

  const a = (right + left) / (right - left);
  const b = (top + bottom) / (top - bottom);
  const c = -(far + near) / (far - near);
  const d = (-2 * far * near) / (far - near);

  return result.set(x, 0, a, 0, 0, y, b, 0, 0, 0, c, d, 0, 0, -1, 0);
}

export function makeMatrix4PerspectiveFov(
  verticalFov: number,
  near: number,
  far: number,
  zoom: number,
  aspectRatio: number,
  result = new Matrix4()
): Matrix4 {
  const height = (2 * near * Math.tan((verticalFov * Math.PI) / 180)) / zoom;
  const width = height * aspectRatio;

  // NOTE: OpenGL screen coordinates are -bottomt to +top, -left to +right.

  const right = width * 0.5;
  const left = right - width;

  const top = height * 0.5;
  const bottom = top - height;

  return makeMatrix4Perspective(left, right, top, bottom, near, far, result);
}

// TODO: Replace with a Box3?
export function makeMatrix4Orthographic(
  left: number,
  right: number,
  top: number,
  bottom: number,
  near: number,
  far: number,
  result = new Matrix4()
): Matrix4 {
  const w = 1 / (right - left);
  const h = 1 / (top - bottom);
  const p = 1 / (far - near);

  const x = (right + left) * w;
  const y = (top + bottom) * h;
  const z = (far + near) * p;

  return result.set(
    2 * w,
    0,
    0,
    -x,
    0,
    2 * h,
    0,
    -y,
    0,
    0,
    -2 * p,
    -z,
    0,
    0,
    0,
    1
  );
}

export function makeMatrix4OrthographicSimple(
  height: number,
  center: Vector2,
  near: number,
  far: number,
  zoom: number,
  aspectRatio = 1,
  result = new Matrix4()
): Matrix4 {
  height /= zoom;
  const width = height * aspectRatio;

  const left = -width * 0.5 + center.x;
  const right = left + width;

  const top = -height * 0.5 + center.y;
  const bottom = top + height;

  return makeMatrix4Orthographic(left, right, top, bottom, near, far, result);
}
