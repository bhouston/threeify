import { Euler3, EulerOrder3 } from './Euler3';
import { quatToEuler3 } from './Euler3.Functions';
import {
  euler3ToMat4,
  mat4Delta,
  mat4Multiply,
  mat4TransformPoint3,
  quatToMat4
} from './Mat4.Functions';
import { Quat } from './Quat';
import {
  euler3ToQuat,
  mat4ToQuat,
  quatAngleTo,
  quatConjugate,
  quatDelta,
  quatDot,
  quatExp,
  quatLength,
  quatLengthSq,
  quatLn,
  quatMultiply,
  quatMultiplyByScalar,
  quatNormalize,
  quatPow,
  quatRotateTowards,
  quatSlerp,
  quatTransformPoint3
} from './Quat.Functions';
import { Vec3 } from './Vec3';
import { vec3Delta } from './Vec3.Functions';
import { Vec4 } from './Vec4';

const qX = quatNormalize(new Quat(1, 0, 0));
const qY = quatNormalize(new Quat(0, 1, 0));
const qZ = quatNormalize(new Quat(0, 0, 1));
const qW = quatNormalize(new Quat(0, 0, 0, 1));
const qXY = quatNormalize(new Quat(1, 0.5, 0));
const qYZ = quatNormalize(new Quat(0, 1, 0.5));
const qXZ = quatNormalize(new Quat(0.5, 0, 1));
const qXYZ = quatNormalize(new Quat(0.25, 0.5, 1));
const qXYW = quatNormalize(new Quat(1, 0.5, 0, 0.25));
const qYZW = quatNormalize(new Quat(0, 1, 0.5, 0.25));
const qXZW = quatNormalize(new Quat(0.5, 0, 1, 0.25));

function changeEulerOrder(euler: Euler3, order: EulerOrder3): Euler3 {
  return new Euler3(euler.x, euler.y, euler.z, order);
}

const eulerAngles = new Euler3(0.1, -0.3, 0.25);

const testValues = [qX, qY, qZ, qW, qXY, qYZ, qXZ, qXYZ, qXYW, qYZW, qXZW];
const testOrders = [
  EulerOrder3.XYZ,
  EulerOrder3.YXZ,
  EulerOrder3.ZXY,
  EulerOrder3.ZYX,
  EulerOrder3.YZX,
  EulerOrder3.XZY
];

describe('Quat Functions', () => {
  test('invert/conjugate', () => {
    const a = new Quat(1, 2, 3, 4);

    // TODO: add better validation here.

    const b = quatConjugate(a);

    expect(a.x).toBe(-b.x);
    expect(a.y).toBe(-b.y);
    expect(a.z).toBe(-b.z);
    expect(a.w).toBe(b.w);
  });

  test('dot', () => {
    let a = new Quat();
    let b = new Quat();

    expect(quatDot(a, b)).toBe(1);
    a = new Quat(1, 2, 3, 1);
    b = new Quat(3, 2, 1, 1);

    expect(quatDot(a, b)).toBe(11);
  });

  test('length', () => {
    let a = new Quat();
    expect(quatLength(a)).toBe(1);
    a = new Quat(1, 2, 3, 4);
    expect(quatLength(a)).toBe(Math.sqrt(30));
  });

  test('normalize', () => {
    const a = new Quat(1, 2, 3, 4);
    const b = quatNormalize(a);
    expect(quatLength(b)).toBeCloseTo(1);
  });

  test('quatMultiplyByScalar', () => {
    const a = new Quat(1, 2, 3, 4);
    const b = new Quat(2, 4, 6, 8);
    expect(quatMultiplyByScalar(a, 2)).toEqual(b);
  });

  test('quatExp and quatLn', () => {
    const a = quatNormalize(new Quat(1, 2, 3, 4));
    const b = quatExp(quatLn(a));
    expect(b).toEqual(a);
  });

  test('quatPower and quatLn', () => {
    const a = quatNormalize(new Quat(1, 2, 3, 4));
    const b = quatNormalize(quatPow(a, 0));
    expect(b).toEqual(new Quat());
  });

  test('quatPower and quatExp', () => {
    const a = quatNormalize(new Quat(1, 2, 3, 4));
    const b = quatNormalize(quatPow(a, 1));
    expect(b.x).toBeCloseTo(a.x);
    expect(b.y).toBeCloseTo(a.y);
    expect(b.z).toBeCloseTo(a.z);
    expect(b.w).toBeCloseTo(a.w);
  });

  test('quatAngleTo', () => {
    const a = new Quat();
    const b = euler3ToQuat(new Euler3(0, Math.PI, 0));
    const c = euler3ToQuat(new Euler3(0, Math.PI * 2, 0));

    expect(quatAngleTo(a, a)).toBeCloseTo(0);
    expect(quatAngleTo(a, b)).toBeCloseTo(Math.PI);
    expect(quatAngleTo(a, c)).toBeCloseTo(0);
  });

  test('quatRotateTowards', () => {
    const a = new Quat();
    const b = euler3ToQuat(new Euler3(0, Math.PI, 0));
    const c = new Quat();

    const halfPI = Math.PI * 0.5;

    const a2 = quatRotateTowards(a, b, 0);
    expect(quatAngleTo(a, a2)).toBeCloseTo(0);
    expect(quatAngleTo(a2, b)).toBeCloseTo(Math.PI);

    // overshoot test
    const a3 = quatRotateTowards(a, b, Math.PI * 2);
    expect(quatAngleTo(a3, b)).toBeCloseTo(0);

    const a4 = quatRotateTowards(a, b, halfPI);
    expect(quatAngleTo(a4, c)).toBeCloseTo(halfPI);
  });

  test('quatMultiply', () => {
    const angles = [
      new Euler3(1, 0, 0),
      new Euler3(0, 1, 0),
      new Euler3(0, 0, 1)
    ];

    const q1 = euler3ToQuat(changeEulerOrder(angles[0], EulerOrder3.XYZ));
    const q2 = euler3ToQuat(changeEulerOrder(angles[1], EulerOrder3.XYZ));
    const q3 = euler3ToQuat(changeEulerOrder(angles[2], EulerOrder3.XYZ));

    const q = quatMultiply(quatMultiply(q1, q2), q3);
    const qq = quatMultiply(q1, quatMultiply(q2, q3));

    expect(quatDelta(q, qq)).toBeCloseTo(0);

    const m1 = euler3ToMat4(changeEulerOrder(angles[0], EulerOrder3.XYZ));
    const m2 = euler3ToMat4(changeEulerOrder(angles[1], EulerOrder3.XYZ));
    const m3 = euler3ToMat4(changeEulerOrder(angles[2], EulerOrder3.XYZ));

    const m = mat4Multiply(m1, mat4Multiply(m2, m3));
    const mm = mat4Multiply(mat4Multiply(m1, m2), m3);

    expect(mat4Delta(m, mm)).toBeCloseTo(0);

    const qFromM = mat4ToQuat(m);

    expect(quatDelta(q, qFromM)).toBeCloseTo(0);
  });

  test('normalize/length/lengthSq', () => {
    const a = new Quat(2, 3, 4, 5);
    expect(quatLength(a)).not.toBe(1);
    expect(quatLengthSq(a)).not.toBe(1);

    quatNormalize(a, a);
    expect(quatLength(a)).toBe(1);
    expect(quatLengthSq(a)).toBe(1);

    a.set(0, 0, 0, 0);
    expect(quatLengthSq(a)).toBe(0);
    expect(quatLength(a)).toBe(0);

    quatNormalize(a, a);
    expect(quatLength(a)).toBe(1);
    expect(quatLengthSq(a)).toBe(1);
  });

  test('slerp', () => {
    const a = new Quat(2, 3, 4, 5);
    const b = new Quat(-2, -3, -4, -5);

    const a1 = quatSlerp(a, b, 0);
    const b1 = quatSlerp(a, b, 1);

    expect(quatDelta(a, a1)).toBeCloseTo(0);
    expect(quatDelta(b, b1)).toBeCloseTo(0);

    const D = Math.SQRT1_2;

    const e = new Quat(1, 0, 0, 0);
    const f = new Quat(0, 0, 1, 0);
    let expected = new Quat(D, 0, D, 0);
    let result = quatSlerp(e, f, 0.5);
    expect(quatDelta(result, expected)).toBeCloseTo(0);

    const g = new Quat(0, D, 0, D);
    const h = new Quat(0, -D, 0, D);
    expected = new Quat(0, 0, 0, 1);
    result = quatSlerp(g, h, 0.5);

    expect(quatDelta(result, expected)).toBeCloseTo(0);
  });

  test('euler3ToQuat/mat4ToQuat', () => {
    // ensure euler conversion for Quaternion matches that of Matrix4
    for (let i = 0; i < testOrders.length; i++) {
      const q = euler3ToQuat(changeEulerOrder(eulerAngles, testOrders[i]));
      const m = euler3ToMat4(changeEulerOrder(eulerAngles, testOrders[i]));
      const q2 = mat4ToQuat(m);

      expect(quatDelta(q, q2)).toBeCloseTo(0);
    }
  });

  test('mat4ToQuat 1', () => {
    // contrived examples purely to please the god of code coverage...
    // match conditions in various 'else [if]' blocks

    const q = quatNormalize(new Quat(-9, -2, 3, -4));
    const m = quatToMat4(q);
    const expected = new Quat(
      0.8581163303210332,
      0.19069251784911848,
      -0.2860387767736777,
      0.38138503569823695
    );
    const q2 = mat4ToQuat(m);
    expect(quatDelta(q, q2)).toBeCloseTo(0);
    expect(quatDelta(q2, expected)).toBeCloseTo(0);
  });

  test('mat4ToQuat 2', () => {
    // contrived examples purely to please the god of code coverage...
    // match conditions in various 'else [if]' blocks

    const q = quatNormalize(new Quat(-1, -2, 1, -1));
    const m = quatToMat4(q);
    const expected = new Quat(
      0.37796447300922714,
      0.7559289460184544,
      -0.37796447300922714,
      0.37796447300922714
    );
    const q2 = mat4ToQuat(m);
    expect(quatDelta(q, q2)).toBeCloseTo(0);
    expect(quatDelta(q2, expected)).toBeCloseTo(0);
  });

  test('quatTransformPoint3', () => {
    const angles = [
      new Euler3(1, 0, 0),
      new Euler3(0, 1, 0),
      new Euler3(0, 0, 1)
    ];

    // ensure euler conversion for Quaternion matches that of Matrix4
    for (let i = 0; i < testOrders.length; i++) {
      for (let j = 0; j < angles.length; j++) {
        const q = euler3ToQuat(changeEulerOrder(angles[j], testOrders[i]));
        const m = euler3ToMat4(changeEulerOrder(angles[j], testOrders[i]));

        const v0 = new Vec3(1, 0, 0);
        const qv = quatTransformPoint3(q, v0);
        const mv = mat4TransformPoint3(m, v0);

        expect(vec3Delta(qv, mv)).toBeCloseTo(0);
      }
    }
  });
});

describe('Quat-Euler3', () => {
  testValues.forEach((q, qi) => {
    testOrders.forEach((eulerOrder, ei) => {
      test(`q${qi} order ${ei}`, () => {
        const e = quatToEuler3(q, eulerOrder);
        const q2 = euler3ToQuat(e);
        expect(quatDelta(q2, q)).toBeCloseTo(0);
      });
    });
  });
});

describe('Quat-Mat4', () => {
  testValues.forEach((q, qi) => {
    test(`q ${qi}`, () => {
      const m = quatToMat4(q);
      const q2 = mat4ToQuat(m);
      expect(quatDelta(q2, q)).toBeCloseTo(0);
    });
  });
});

describe('Quat-Mat4', () => {
  test('Quat-Mat4 explicit 1', () => {
    // contrived examples purely to please the god of code coverage...
    // match conditions in various 'else [if]' blocks

    const a = new Quat();
    const q = quatNormalize(new Quat(-9, -2, 3, -4));
    const m = quatToMat4(q);
    const expected = new Vec4(
      0.8581163303210332,
      0.19069251784911848,
      -0.2860387767736777,
      0.38138503569823695
    );

    mat4ToQuat(m, a);

    expect(quatDelta(a, expected)).toBeCloseTo(0);
  });

  test('Quat-Mat4 explicit 2', () => {
    const a = new Quat();
    const q = quatNormalize(new Quat(-1, -2, 1, -1));
    const m = quatToMat4(q);
    const expected = new Vec4(
      0.37796447300922714,
      0.7559289460184544,
      -0.37796447300922714,
      0.37796447300922714
    );

    mat4ToQuat(m, a);
    expect(quatDelta(a, expected)).toBeCloseTo(0);
  });
});
