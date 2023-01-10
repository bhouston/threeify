import { Euler3, EulerOrder3 } from './Euler3';
import { quatToEuler3 } from './Euler3.Functions';
import { delta, EPSILON } from './Functions';
import {
  euler3ToMat4,
  mat4Delta,
  mat4Multiply,
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
  quatLn,
  quatMultiply,
  quatMultiplyByScalar,
  quatNormalize,
  quatPow,
  quatRotateTowards,
  quatSubtract
} from './Quat.Functions';
import { Vec4 } from './Vec4';

// many of these are based on three.j tests.
const orders = ['XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY'];
const eulerAngles = new Euler3(0.1, -0.3, 0.25);

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

function changeEulerOrder(euler, order) {
  return new Euler3(euler.x, euler.y, euler.z, order);
}
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

    const q1 = euler3ToQuat(changeEulerOrder(angles[0], 'XYZ'));
    const q2 = euler3ToQuat(changeEulerOrder(angles[1], 'XYZ'));
    const q3 = euler3ToQuat(changeEulerOrder(angles[2], 'XYZ'));

    const q = quatMultiply(quatMultiply(q1, q2), q3);
    const qq = quatMultiply(q1, quatMultiply(q2, q3));

    expect(quatDelta(q, qq)).toBeCloseTo(0);

    const m1 = euler3ToMat4(changeEulerOrder(angles[0], 'XYZ'));
    const m2 = euler3ToMat4(changeEulerOrder(angles[1], 'XYZ'));
    const m3 = euler3ToMat4(changeEulerOrder(angles[2], 'XYZ'));

    const m = mat4Multiply(m1, mat4Multiply(m2, m3));
    const mm = mat4Multiply(mat4Multiply(m1, m2), m3);

    expect(mat4Delta(m, mm)).toBeCloseTo(0);

    const qFromM = mat4ToQuat(m);

    expect(quatDelta(q, qFromM)).toBeCloseTo(0);
  });
});

describe('Quat-Euler3', () => {
  testValues.forEach((q, qi) => {
    testOrders.forEach((eulerOrder, ei) => {
      test(`q${qi} order ${ei}`, () => {
        const e = quatToEuler3(q, eulerOrder);
        const q2 = euler3ToQuat(e);
        expect(quatLength(quatSubtract(q2, q))).toBeLessThan(0.000001);
      });
    });
  });
});

describe('Quat-Mat4', () => {
  testValues.forEach((q, qi) => {
    test(`q ${qi}`, () => {
      const m = quatToMat4(q);
      const q2 = mat4ToQuat(m);
      expect(quatLength(quatSubtract(q2, q))).toBeLessThan(0.000001);
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
    expect(delta(a.x, expected.x)).toBeLessThan(EPSILON);
    expect(delta(a.y, expected.y)).toBeLessThan(EPSILON);
    expect(delta(a.z, expected.z)).toBeLessThan(EPSILON);
    expect(delta(a.w, expected.w)).toBeLessThan(EPSILON);
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
    expect(delta(a.x, expected.x)).toBeLessThan(EPSILON);
    expect(delta(a.y, expected.y)).toBeLessThan(EPSILON);
    expect(delta(a.z, expected.z)).toBeLessThan(EPSILON);
    expect(delta(a.w, expected.w)).toBeLessThan(EPSILON);
  });
});
