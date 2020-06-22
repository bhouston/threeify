import { Euler, EulerOrder } from "./Euler";
import { Matrix4 } from "./Matrix4";
import { Quaternion } from "./Quaternion";
import { Vector3 } from "./Vector3";

export function makeQuaternionFromEuler(q: Quaternion, e: Euler): Quaternion {
  const x = e.x,
    y = e.y,
    z = e.z,
    order = e.order;

  // eslint-disable-next-line max-len
  // http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m

  const c1 = Math.cos(x / 2);
  const c2 = Math.cos(y / 2);
  const c3 = Math.cos(z / 2);

  const s1 = Math.sin(x / 2);
  const s2 = Math.sin(y / 2);
  const s3 = Math.sin(z / 2);

  switch (order) {
    case EulerOrder.XYZ:
      q.x = s1 * c2 * c3 + c1 * s2 * s3;
      q.y = c1 * s2 * c3 - s1 * c2 * s3;
      q.z = c1 * c2 * s3 + s1 * s2 * c3;
      q.w = c1 * c2 * c3 - s1 * s2 * s3;
      break;

    case EulerOrder.YXZ:
      q.x = s1 * c2 * c3 + c1 * s2 * s3;
      q.y = c1 * s2 * c3 - s1 * c2 * s3;
      q.z = c1 * c2 * s3 - s1 * s2 * c3;
      q.w = c1 * c2 * c3 + s1 * s2 * s3;
      break;

    case EulerOrder.ZXY:
      q.x = s1 * c2 * c3 - c1 * s2 * s3;
      q.y = c1 * s2 * c3 + s1 * c2 * s3;
      q.z = c1 * c2 * s3 + s1 * s2 * c3;
      q.w = c1 * c2 * c3 - s1 * s2 * s3;
      break;

    case EulerOrder.ZYX:
      q.x = s1 * c2 * c3 - c1 * s2 * s3;
      q.y = c1 * s2 * c3 + s1 * c2 * s3;
      q.z = c1 * c2 * s3 - s1 * s2 * c3;
      q.w = c1 * c2 * c3 + s1 * s2 * s3;
      break;

    case EulerOrder.YZX:
      q.x = s1 * c2 * c3 + c1 * s2 * s3;
      q.y = c1 * s2 * c3 + s1 * c2 * s3;
      q.z = c1 * c2 * s3 - s1 * s2 * c3;
      q.w = c1 * c2 * c3 - s1 * s2 * s3;
      break;

    case EulerOrder.XZY:
      q.x = s1 * c2 * c3 - c1 * s2 * s3;
      q.y = c1 * s2 * c3 - s1 * c2 * s3;
      q.z = c1 * c2 * s3 + s1 * s2 * c3;
      q.w = c1 * c2 * c3 + s1 * s2 * s3;
      break;
  }

  return q;
}

export function makeQuaternionFromRotationMatrix4(q: Quaternion, m: Matrix4): Quaternion {
  // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

  // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

  // TODO, allocate x, y, z, w and only set q.* at the end.

  const te = m.elements,
    m11 = te[0],
    m12 = te[4],
    m13 = te[8],
    m21 = te[1],
    m22 = te[5],
    m23 = te[9],
    m31 = te[2],
    m32 = te[6],
    m33 = te[10],
    trace = m11 + m22 + m33;
  let s;

  if (trace > 0) {
    s = 0.5 / Math.sqrt(trace + 1.0);

    q.w = 0.25 / s;
    q.x = (m32 - m23) * s;
    q.y = (m13 - m31) * s;
    q.z = (m21 - m12) * s;
  } else if (m11 > m22 && m11 > m33) {
    s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

    q.w = (m32 - m23) / s;
    q.x = 0.25 * s;
    q.y = (m12 + m21) / s;
    q.z = (m13 + m31) / s;
  } else if (m22 > m33) {
    s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

    q.w = (m13 - m31) / s;
    q.x = (m12 + m21) / s;
    q.y = 0.25 * s;
    q.z = (m23 + m32) / s;
  } else {
    s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

    q.w = (m21 - m12) / s;
    q.x = (m13 + m31) / s;
    q.y = (m23 + m32) / s;
    q.z = 0.25 * s;
  }

  return q;
}

export function makeQuaternionFromAxisAngle(q: Quaternion, axis: Vector3, angle: number): Quaternion {
  // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

  // assumes axis is normalized

  const halfAngle = angle / 2,
    s = Math.sin(halfAngle);

  q.x = axis.x * s;
  q.y = axis.y * s;
  q.z = axis.z * s;
  q.w = Math.cos(halfAngle);

  return q;
}

export function makeQuaternionFromBaryCoordWeights(
  baryCoord: Vector3,
  a: Quaternion,
  b: Quaternion,
  c: Quaternion,
  result = new Quaternion(),
): Quaternion {
  result.x = a.x * baryCoord.x + b.x * baryCoord.y + c.x * baryCoord.z;
  result.y = a.y * baryCoord.x + b.y * baryCoord.y + c.y * baryCoord.z;
  result.z = a.z * baryCoord.x + b.z * baryCoord.y + c.z * baryCoord.z;
  result.w = a.w * baryCoord.x + b.w * baryCoord.y + c.w * baryCoord.z;
  return result;
}
