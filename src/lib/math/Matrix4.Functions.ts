import { Euler, EulerOrder } from "./Euler";
import { Matrix4 } from "./Matrix4";
import { Quaternion } from "./Quaternion";
import { makeQuaternionFromRotationMatrix4 } from "./Quaternion.Functions";
import { Vector3 } from "./Vector3";

export function makeMatrix4Translation(m: Matrix4, t: Vector3): Matrix4 {
  return m.set(1, 0, 0, t.x, 0, 1, 0, t.y, 0, 0, 1, t.z, 0, 0, 0, 1);
}

export function makeMatrix4RotationFromAngleAxis(m: Matrix4, axis: Vector3, angle: number): Matrix4 {
  // Based on http://www.gamedev.net/reference/articles/article1199.asp

  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const t = 1 - c;
  const x = axis.x,
    y = axis.y,
    z = axis.z;
  const tx = t * x,
    ty = t * y;

  return m.set(
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
    1,
  );
}

export function makeMatrix4RotationFromEuler(m: Matrix4, euler: Euler): Matrix4 {
  const te = m.elements;

  const x = euler.x,
    y = euler.y,
    z = euler.z;
  const a = Math.cos(x),
    b = Math.sin(x);
  const c = Math.cos(y),
    d = Math.sin(y);
  const e = Math.cos(z),
    f = Math.sin(z);

  // TODO: Replace smart code that compacts all of these orders into one
  if (euler.order === EulerOrder.XYZ) {
    const ae = a * e,
      af = a * f,
      be = b * e,
      bf = b * f;

    te[0] = c * e;
    te[4] = -c * f;
    te[8] = d;

    te[1] = af + be * d;
    te[5] = ae - bf * d;
    te[9] = -b * c;

    te[2] = bf - ae * d;
    te[6] = be + af * d;
    te[10] = a * c;
  } else if (euler.order === EulerOrder.YXZ) {
    const ce = c * e,
      cf = c * f,
      de = d * e,
      df = d * f;

    te[0] = ce + df * b;
    te[4] = de * b - cf;
    te[8] = a * d;

    te[1] = a * f;
    te[5] = a * e;
    te[9] = -b;

    te[2] = cf * b - de;
    te[6] = df + ce * b;
    te[10] = a * c;
  } else if (euler.order === EulerOrder.ZXY) {
    const ce = c * e,
      cf = c * f,
      de = d * e,
      df = d * f;

    te[0] = ce - df * b;
    te[4] = -a * f;
    te[8] = de + cf * b;

    te[1] = cf + de * b;
    te[5] = a * e;
    te[9] = df - ce * b;

    te[2] = -a * d;
    te[6] = b;
    te[10] = a * c;
  } else if (euler.order === EulerOrder.ZYX) {
    const ae = a * e,
      af = a * f,
      be = b * e,
      bf = b * f;

    te[0] = c * e;
    te[4] = be * d - af;
    te[8] = ae * d + bf;

    te[1] = c * f;
    te[5] = bf * d + ae;
    te[9] = af * d - be;

    te[2] = -d;
    te[6] = b * c;
    te[10] = a * c;
  } else if (euler.order === EulerOrder.YZX) {
    const ac = a * c,
      ad = a * d,
      bc = b * c,
      bd = b * d;

    te[0] = c * e;
    te[4] = bd - ac * f;
    te[8] = bc * f + ad;

    te[1] = f;
    te[5] = a * e;
    te[9] = -b * e;

    te[2] = -d * e;
    te[6] = ad * f + bc;
    te[10] = ac - bd * f;
  } else if (euler.order === EulerOrder.XZY) {
    const ac = a * c,
      ad = a * d,
      bc = b * c,
      bd = b * d;

    te[0] = c * e;
    te[4] = -f;
    te[8] = d * e;

    te[1] = ac * f + bd;
    te[5] = a * e;
    te[9] = ad * f - bc;

    te[2] = bc * f - ad;
    te[6] = b * e;
    te[10] = bd * f + ac;
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

  return m;
}

export function makeMatrix4RotationFromQuaternion(m: Matrix4, q: Quaternion): Matrix4 {
  return composeMatrix4(m, new Vector3(), q, new Vector3(1, 1, 1));
}

export function makeMatrix4Scale(m: Matrix4, s: Vector3): Matrix4 {
  return m.set(s.x, 0, 0, 0, 0, s.y, 0, 0, 0, 0, s.z, 0, 0, 0, 0, 1);
}

export function makeMatrix4Shear(m: Matrix4, x: number, y: number, z: number): Matrix4 {
  return m.set(1, y, z, 0, x, 1, z, 0, x, y, 1, 0, 0, 0, 0, 1);
}

export function composeMatrix4(m: Matrix4, position: Vector3, rotation: Quaternion, scale: Vector3): Matrix4 {
  const x = rotation.x,
    y = rotation.y,
    z = rotation.z,
    w = rotation.w;
  const x2 = x + x,
    y2 = y + y,
    z2 = z + z;
  const xx = x * x2,
    xy = x * y2,
    xz = x * z2;
  const yy = y * y2,
    yz = y * z2,
    zz = z * z2;
  const wx = w * x2,
    wy = w * y2,
    wz = w * z2;

  const sx = scale.x,
    sy = scale.y,
    sz = scale.z;

  return m.set(
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
    1,
  );
}

export function decomposeMatrix4(m: Matrix4, position: Vector3, rotation: Quaternion, scale: Vector3): Matrix4 {
  const te = m.elements;

  let sx = new Vector3(te[0], te[1], te[2]).length();
  const sy = new Vector3(te[4], te[5], te[6]).length();
  const sz = new Vector3(te[8], te[9], te[10]).length();

  // if determine is negative, we need to invert one scale
  if (m.determinant() < 0) {
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

  makeQuaternionFromRotationMatrix4(rotation, m);

  scale.x = sx;
  scale.y = sy;
  scale.z = sz;

  return m;
}

// TODO: Replace with a Box2
export function makeMatrix4Perspective(
  m: Matrix4,
  left: number,
  right: number,
  top: number,
  bottom: number,
  near: number,
  far: number,
): Matrix4 {
  const x = (2 * near) / (right - left);
  const y = (2 * near) / (top - bottom);

  const a = (right + left) / (right - left);
  const b = (top + bottom) / (top - bottom);
  const c = -(far + near) / (far - near);
  const d = (-2 * far * near) / (far - near);

  return m.set(x, 0, a, 0, 0, y, b, 0, 0, 0, c, d, 0, 0, -1, 0);
}

// TODO: Replace with a Box3?
export function makeMatrix4Orthographic(
  m: Matrix4,
  left: number,
  right: number,
  top: number,
  bottom: number,
  near: number,
  far: number,
): Matrix4 {
  const w = 1.0 / (right - left);
  const h = 1.0 / (top - bottom);
  const p = 1.0 / (far - near);

  const x = (right + left) * w;
  const y = (top + bottom) * h;
  const z = (far + near) * p;

  return m.set(2 * w, 0, 0, -x, 0, 2 * h, 0, -y, 0, 0, -2 * p, -z, 0, 0, 0, 1);
}
