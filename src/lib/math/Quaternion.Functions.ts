import { Euler3, EulerOrder3 } from './Euler3.js';
import { Matrix4 } from './Matrix4.js';
import { Quaternion } from './Quaternion.js';
import { Vector3 } from './Vector3.js';

export function makeQuaternionFromEuler(
  e: Euler3,
  result = new Quaternion()
): Quaternion {
  const { x } = e;
  const { y } = e;
  const { z } = e;
  const { order } = e;

  // eslint-disable-next-line max-len
  // http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m

  const c1 = Math.cos(x / 2);
  const c2 = Math.cos(y / 2);
  const c3 = Math.cos(z / 2);

  const s1 = Math.sin(x / 2);
  const s2 = Math.sin(y / 2);
  const s3 = Math.sin(z / 2);

  switch (order) {
    case EulerOrder3.XYZ:
      return result.set(
        s1 * c2 * c3 + c1 * s2 * s3,
        c1 * s2 * c3 - s1 * c2 * s3,
        c1 * c2 * s3 + s1 * s2 * c3,
        c1 * c2 * c3 - s1 * s2 * s3
      );

    case EulerOrder3.YXZ:
      return result.set(
        s1 * c2 * c3 + c1 * s2 * s3,
        c1 * s2 * c3 - s1 * c2 * s3,
        c1 * c2 * s3 - s1 * s2 * c3,
        c1 * c2 * c3 + s1 * s2 * s3
      );

    case EulerOrder3.ZXY:
      return result.set(
        s1 * c2 * c3 - c1 * s2 * s3,
        c1 * s2 * c3 + s1 * c2 * s3,
        c1 * c2 * s3 + s1 * s2 * c3,
        c1 * c2 * c3 - s1 * s2 * s3
      );

    case EulerOrder3.ZYX:
      return result.set(
        s1 * c2 * c3 - c1 * s2 * s3,
        c1 * s2 * c3 + s1 * c2 * s3,
        c1 * c2 * s3 - s1 * s2 * c3,
        c1 * c2 * c3 + s1 * s2 * s3
      );

    case EulerOrder3.YZX:
      return result.set(
        s1 * c2 * c3 + c1 * s2 * s3,
        c1 * s2 * c3 + s1 * c2 * s3,
        c1 * c2 * s3 - s1 * s2 * c3,
        c1 * c2 * c3 - s1 * s2 * s3
      );

    case EulerOrder3.XZY:
      return result.set(
        s1 * c2 * c3 - c1 * s2 * s3,
        c1 * s2 * c3 - s1 * c2 * s3,
        c1 * c2 * s3 + s1 * s2 * c3,
        c1 * c2 * c3 + s1 * s2 * s3
      );

    default:
      throw new Error('unsupported euler order');
  }
}

export function makeQuaternionFromRotationMatrix4(
  m: Matrix4,
  result = new Quaternion()
): Quaternion {
  // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

  // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

  // TODO, allocate x, y, z, w and only set q.* at the end.

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
  const trace = m11 + m22 + m33;

  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1);

    return result.set(
      (m32 - m23) * s,
      (m13 - m31) * s,
      (m21 - m12) * s,
      0.25 / s
    );
  }
  if (m11 > m22 && m11 > m33) {
    const s = 2 * Math.sqrt(1 + m11 - m22 - m33);

    return result.set(
      0.25 * s,
      (m12 + m21) / s,
      (m13 + m31) / s,
      (m32 - m23) / s
    );
  }
  if (m22 > m33) {
    const s = 2 * Math.sqrt(1 + m22 - m11 - m33);

    return result.set(
      (m12 + m21) / s,
      0.25 * s,
      (m23 + m32) / s,
      (m13 - m31) / s
    );
  }

  const s = 2 * Math.sqrt(1 + m33 - m11 - m22);

  return result.set(
    (m13 + m31) / s,
    (m23 + m32) / s,
    0.25 * s,
    (m21 - m12) / s
  );
}

export function makeQuaternionFromAxisAngle(
  axis: Vector3,
  angle: number,
  result = new Quaternion()
): Quaternion {
  // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

  // assumes axis is normalized

  const halfAngle = angle / 2;
  const s = Math.sin(halfAngle);

  return result.set(axis.x * s, axis.y * s, axis.z * s, Math.cos(halfAngle));
}

export function makeQuaternionFromBaryCoordWeights(
  baryCoord: Vector3,
  a: Quaternion,
  b: Quaternion,
  c: Quaternion,
  result = new Quaternion()
): Quaternion {
  const v = baryCoord;
  return result.set(
    a.x * v.x + b.x * v.y + c.x * v.z,
    a.y * v.x + b.y * v.y + c.y * v.z,
    a.z * v.x + b.z * v.y + c.z * v.z,
    a.w * v.x + b.w * v.y + c.w * v.z
  );
}
