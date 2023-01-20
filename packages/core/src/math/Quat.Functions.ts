import { Euler3, EulerOrder3 } from './Euler3.js';
import {
  delta,
  EPSILON,
  equalsTolerance,
  parseSafeFloats,
  toSafeString
} from './Functions.js';
import { mat4ToMat3 } from './Mat3.Functions.js';
import { Mat3 } from './Mat3.js';
import { Mat4 } from './Mat4.js';
import { Quat } from './Quat.js';
import { Vec3 } from './Vec3.js';

export function quatDelta(a: Quat, b: Quat): number {
  return delta(a.x, b.x) + delta(a.y, b.y) + delta(a.z, b.z) + delta(a.w, b.w);
}

export function quatRandomUnit(result = new Quat()): Quat {
  // Derived from http://planning.cs.uiuc.edu/node198.html
  // Note, this source uses w, x, y, z ordering,
  // so we swap the order below.

  const u1 = Math.random();
  const sqrt1u1 = Math.sqrt(1 - u1);
  const sqrtu1 = Math.sqrt(u1);

  const u2 = 2 * Math.PI * Math.random();

  const u3 = 2 * Math.PI * Math.random();

  return result.set(
    sqrt1u1 * Math.cos(u2),
    sqrtu1 * Math.sin(u3),
    sqrtu1 * Math.cos(u3),
    sqrt1u1 * Math.sin(u2)
  );
}

export function quatEquals(
  a: Quat,
  b: Quat,
  tolerance: number = EPSILON
): boolean {
  return (
    equalsTolerance(a.x, b.x, tolerance) &&
    equalsTolerance(a.y, b.y, tolerance) &&
    equalsTolerance(a.z, b.z, tolerance) &&
    equalsTolerance(a.w, b.w, tolerance)
  );
}
export function quatAdd(a: Quat, b: Quat, result = new Quat()): Quat {
  return result.set(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
}
export function quatSubtract(a: Quat, b: Quat, result = new Quat()): Quat {
  return result.set(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
}
export function quatMultiplyByScalar(
  a: Quat,
  b: number,
  result = new Quat()
): Quat {
  return result.set(a.x * b, a.y * b, a.z * b, a.w * b);
}
export function quatNegate(a: Quat, result = new Quat()): Quat {
  return result.set(-a.x, -a.y, -a.z, -a.w);
}
export function quatLength(a: Quat): number {
  return Math.sqrt(quatDot(a, a));
}
export function quatLengthSq(a: Quat): number {
  return quatDot(a, a);
}
export function quatNormalize(a: Quat, result = new Quat()): Quat {
  const length = quatLength(a);
  if (length === 0) {
    return result.set(0, 0, 0, 1);
  }
  return quatMultiplyByScalar(a, 1 / length, result);
}
export function quatDot(a: Quat, b: Quat): number {
  return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
}
export function quatLerp(
  a: Quat,
  b: Quat,
  t: number,
  result = new Quat()
): Quat {
  const s = 1 - t;
  return result.set(
    a.x * s + b.x * t,
    a.y * s + b.y * t,
    a.z * s + b.z * t,
    a.w * s + b.w * t
  );
}
export function quatFromArray(
  array: Float32Array | number[],
  offset = 0,
  result = new Quat()
): Quat {
  return result.set(
    array[offset + 0],
    array[offset + 1],
    array[offset + 2],
    array[offset + 3]
  );
}
export function quatToArray(
  a: Quat,
  array: Float32Array | number[],
  offset = 0
): void {
  array[offset + 0] = a.x;
  array[offset + 1] = a.y;
  array[offset + 2] = a.z;
  array[offset + 3] = a.w;
}
export function quatToString(a: Quat): string {
  return toSafeString([a.x, a.y, a.z, a.w]);
}
export function quatParse(text: string, result = new Quat()): Quat {
  return quatFromArray(parseSafeFloats(text), 0, result);
}
export function quatConjugate(a: Quat, result = new Quat()): Quat {
  return result.set(-a.x, -a.y, -a.z, a.w);
}
export function quatMultiply(a: Quat, b: Quat, result = new Quat()): Quat {
  // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quats/code/index.htm

  const qax = a.x;
  const qay = a.y;
  const qaz = a.z;
  const qaw = a.w;
  const qbx = b.x;
  const qby = b.y;
  const qbz = b.z;
  const qbw = b.w;

  return result.set(
    qax * qbw + qaw * qbx + qay * qbz - qaz * qby,
    qay * qbw + qaw * qby + qaz * qbx - qax * qbz,
    qaz * qbw + qaw * qbz + qax * qby - qay * qbx,
    qaw * qbw - qax * qbx - qay * qby - qaz * qbz
  );
}

export function quatRotateX( q: Quat, angle: number, result = new Quat() ): Quat {
  const halfAngle = angle * 0.5;
  const s = Math.sin(halfAngle);
  return result.set(s, 0, 0, Math.cos(halfAngle));
}

export function quatRotateY( q: Quat, angle: number, result = new Quat() ): Quat {
  const halfAngle = angle * 0.5;
  const s = Math.sin(halfAngle);
  return result.set(0, s, 0, Math.cos(halfAngle));
}

export function quatRotateZ( q: Quat, angle: number, result = new Quat() ): Quat {
  const halfAngle = angle * 0.5;
  const s = Math.sin(halfAngle);
  return result.set(0, 0, s, Math.cos(halfAngle));
}

export function quatTransformPoint3(
  q: Quat,
  p: Vec3,
  result = new Vec3()
): Vec3 {
  const { x, y, z } = p;
  const { x: qx, y: qy, z: qz, w: qw } = q;

  // calculate quat * vector

  const ix = qw * x + qy * z - qz * y;
  const iy = qw * y + qz * x - qx * z;
  const iz = qw * z + qx * y - qy * x;
  const iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quat

  return result.set(
    ix * qw + iw * -qx + iy * -qz - iz * -qy,
    iy * qw + iw * -qy + iz * -qx - ix * -qz,
    iz * qw + iw * -qz + ix * -qy - iy * -qx
  );
}

export function quatSlerp(
  a: Quat,
  b: Quat,
  t: number,
  result = new Quat()
): Quat {
  if (t <= 0) return a.clone(result);
  if (t >= 1) return b.clone(result);

  // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quats/slerp/

  let cosHalfTheta = quatDot(a, b);

  if (cosHalfTheta < 0) {
    quatNegate(b, result);

    cosHalfTheta = -cosHalfTheta;
  } else {
    b.clone(result);
  }

  if (cosHalfTheta >= 1) {
    return result;
  }

  const sqrSinHalfTheta = 1 - cosHalfTheta * cosHalfTheta;

  if (sqrSinHalfTheta <= Number.EPSILON) {
    quatLerp(a, result, t);
    quatNormalize(result, result);

    return result;
  }

  const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
  const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
  const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
  const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

  result.w = a.w * ratioA + result.w * ratioB;
  result.x = a.x * ratioA + result.x * ratioB;
  result.y = a.y * ratioA + result.y * ratioB;
  result.z = a.z * ratioA + result.z * ratioB;

  return result;
}

export function quatAngleTo(a: Quat, b: Quat): number {
  const dot = quatDot(a, b);
  return Math.acos(2 * dot * dot - 1);
}

export function quatRotateTowards(
  a: Quat,
  b: Quat,
  angle: number,
  result = new Quat()
): Quat {
  const angleTo = quatAngleTo(a, b);
  if (angleTo === 0) return a.clone(result);
  const t = Math.min(1, angle / angleTo);
  return quatSlerp(a, b, t, result);
}

/**
 * Calculate the exponential of a unit quat.
 *
 * @param {quat} out the receiving quat
 * @param {ReadonlyQuat} a quat to calculate the exponential of
 * @returns {quat} out
 */
export function quatExp(a: Quat, result = new Quat()): Quat {
  const { x, y, z, w } = a;

  const r = Math.sqrt(x * x + y * y + z * z);
  const et = Math.exp(w);
  const s = r > 0 ? (et * Math.sin(r)) / r : 0;

  return result.set(x * s, y * s, z * s, et * Math.cos(r));
}

// from gl-matrix
export function quatLn(a: Quat, result = new Quat()): Quat {
  const { x, y, z, w } = a;

  const r = Math.sqrt(x * x + y * y + z * z);
  const t = r > 0 ? Math.atan2(r, w) / r : 0;

  return result.set(
    x * t,
    y * t,
    z * t,
    0.5 * Math.log(x * x + y * y + z * z + w * w)
  );
}

// from gl-matrix
export function quatPow(a: Quat, b: number, result = new Quat()): Quat {
  const ln = quatLn(a);
  const lnScaled = quatMultiplyByScalar(ln, b);
  quatExp(lnScaled, result);
  return result;
}

export function angleAxisToQuat(
  angle: number,
  axis: Vec3,
  result = new Quat()
): Quat {
  // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuat/index.htm

  // assumes axis is normalized

  const halfAngle = angle / 2;
  const s = Math.sin(halfAngle);

  return result.set(axis.x * s, axis.y * s, axis.z * s, Math.cos(halfAngle));
}

// from gl-matrix
export function quatToAngleAxis(
  q: Quat,
  result = new Vec3()
): [angle: number, axis: Vec3] {
  const rad = Math.acos(q.w) * 2;
  const s = Math.sin(rad / 2);
  if (s > EPSILON) {
    result.x = q.x / s;
    result.y = q.y / s;
    result.z = q.z / s;
  } else {
    // If s is zero, return any axis (no rotation - axis does not matter)
    result.x = 1;
    result.y = 0;
    result.z = 0;
  }
  return [rad, result];
}

export function mat4ToQuat(m: Mat4, result = new Quat()): Quat {
  return mat3ToQuat(mat4ToMat3(m), result);
}

export function mat3ToQuat(m: Mat3, result = new Quat()): Quat {
  // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuat/index.htm

  // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

  // TODO, allocate x, y, z, w and only set q.* at the end.

  const te = m.elements,
    m11 = te[0],
    m12 = te[3],
    m13 = te[6],
    m21 = te[1],
    m22 = te[4],
    m23 = te[7],
    m31 = te[2],
    m32 = te[5],
    m33 = te[8],
    trace = m11 + m22 + m33;

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

export function euler3ToQuat(e: Euler3, result = new Quat()): Quat {
  const { x, y, z, order } = e;

  // eslint-disable-next-line max-len
  // http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quats-and-euler-vectors/content/SpinCalc.m

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

// Ben asks in Jan 2023, where the heck is this used?  Where did it come from?
export function barycoordWeightsToQuat(
  baryCoord: Vec3,
  a: Quat,
  b: Quat,
  c: Quat,
  result = new Quat()
): Quat {
  const v = baryCoord;
  return result.set(
    a.x * v.x + b.x * v.y + c.x * v.z,
    a.y * v.x + b.y * v.y + c.y * v.z,
    a.z * v.x + b.z * v.y + c.z * v.z,
    a.w * v.x + b.w * v.y + c.w * v.z
  );
}
