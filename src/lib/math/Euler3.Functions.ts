import { Euler3, EulerOrder3 } from './Euler3';
import { clamp } from './Functions';
import { Matrix4 } from './Matrix4';
import { makeMatrix4RotationFromQuaternion } from './Matrix4.Functions';
import { Quaternion } from './Quaternion';

export function makeEulerFromRotationMatrix4(
  m: Matrix4,
  order: EulerOrder3 = EulerOrder3.Default,
  result = new Euler3()
): Euler3 {
  // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

  const te = m.elements;
  const m11 = te[0];
  const m12 = te[4];
  const m13 = te[8];
  const m21 = te[1];
  const m22 = te[5];
  const m23 = te[9];
  const m31 = te[2];
  const m32 = te[6];
  const m33 = te[10];

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

export function makeEulerFromQuaternion(
  q: Quaternion,
  order: EulerOrder3,
  result = new Euler3()
): Euler3 {
  const m = makeMatrix4RotationFromQuaternion(q);
  return makeEulerFromRotationMatrix4(m, order, result);
}
