import { Euler3, EulerOrder3 } from './Euler3';
import { clamp, delta } from './Functions';
import { mat4ToMat3, quatToMat3 } from './Mat3.Functions';
import { Mat3 } from './Mat3';
import { Mat4 } from './Mat4';
import { Quat } from './Quat';

export function euler3Delta(a: Euler3, b: Euler3): number {
  return delta(a.x, b.x) + delta(a.y, b.y) + delta(a.z, b.z);
}

export function mat4ToEuler3(
  m: Mat4,
  order: EulerOrder3 = EulerOrder3.XYZ,
  result = new Euler3()
): Euler3 {
  return mat3ToEuler3(mat4ToMat3(m), order, result);
}

export function mat3ToEuler3(
  m: Mat3,
  order: EulerOrder3 = EulerOrder3.XYZ,
  result = new Euler3()
): Euler3 {
  // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

  const te = m.elements;
  const m11 = te[0];
  const m12 = te[3];
  const m13 = te[6];
  const m21 = te[1];
  const m22 = te[4];
  const m23 = te[7];
  const m31 = te[2];
  const m32 = te[5];
  const m33 = te[8];

  let x = 0;
  let y = 0;
  let z = 0;

  switch (order) {
    case EulerOrder3.XYZ:
      y = Math.asin(clamp(m13, -1, 1));

      if (Math.abs(m13) < 0.9999999) {
        x = Math.atan2(-m23, m33);
        z = Math.atan2(-m12, m11);
      } else {
        x = Math.atan2(m32, m22);
        z = 0;
      }

      break;

    case EulerOrder3.YXZ:
      x = Math.asin(-clamp(m23, -1, 1));

      if (Math.abs(m23) < 0.9999999) {
        y = Math.atan2(m13, m33);
        z = Math.atan2(m21, m22);
      } else {
        y = Math.atan2(-m31, m11);
        z = 0;
      }

      break;

    case EulerOrder3.ZXY:
      x = Math.asin(clamp(m32, -1, 1));

      if (Math.abs(m32) < 0.9999999) {
        y = Math.atan2(-m31, m33);
        z = Math.atan2(-m12, m22);
      } else {
        y = 0;
        z = Math.atan2(m21, m11);
      }

      break;

    case EulerOrder3.ZYX:
      y = Math.asin(-clamp(m31, -1, 1));

      if (Math.abs(m31) < 0.9999999) {
        x = Math.atan2(m32, m33);
        z = Math.atan2(m21, m11);
      } else {
        x = 0;
        z = Math.atan2(-m12, m22);
      }

      break;

    case EulerOrder3.YZX:
      z = Math.asin(clamp(m21, -1, 1));

      if (Math.abs(m21) < 0.9999999) {
        x = Math.atan2(-m23, m22);
        y = Math.atan2(-m31, m11);
      } else {
        x = 0;
        y = Math.atan2(m13, m33);
      }

      break;

    case EulerOrder3.XZY:
      z = Math.asin(-clamp(m12, -1, 1));

      if (Math.abs(m12) < 0.9999999) {
        x = Math.atan2(m32, m22);
        y = Math.atan2(m13, m11);
      } else {
        x = Math.atan2(-m23, m33);
        y = 0;
      }

      break;
  }

  return result.set(x, y, z, order);
}

export function quatToEuler3(
  q: Quat,
  order: EulerOrder3 = EulerOrder3.XYZ,
  result = new Euler3()
): Euler3 {
  const m = quatToMat3(q);
  return mat3ToEuler3(m, order, result);
}
