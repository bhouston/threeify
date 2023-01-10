import { EulerOrder3 } from './Euler3.js';
import { quatToMat4 } from './Mat4.Functions.js';
import {
  euler3ToQuat,
  mat4ToQuat,
  quatLength,
  quatSubtract
} from './Quat.Functions.js';
import { Quat } from './Quat.js';

const qX = new Quat(1, 0, 0).normalize();
const qY = new Quat(0, 1, 0).normalize();
const qZ = new Quat(0, 0, 1).normalize();
const qW = new Quat(0, 0, 0, 1).normalize();
const qXY = new Quat(1, 0.5, 0).normalize();
const qYZ = new Quat(0, 1, 0.5).normalize();
const qXZ = new Quat(0.5, 0, 1).normalize();
const qXYZ = new Quat(0.25, 0.5, 1).normalize();
const qXYW = new Quat(1, 0.5, 0, 0.25).normalize();
const qYZW = new Quat(0, 1, 0.5, 0.25).normalize();
const qXZW = new Quat(0.5, 0, 1, 0.25).normalize();

const testValues = [qX, qY, qZ, qW, qXY, qYZ, qXZ, qXYZ, qXYW, qYZW, qXZW];
const testOrders = [
  EulerOrder3.XYZ,
  EulerOrder3.YXZ,
  EulerOrder3.ZXY,
  EulerOrder3.ZYX,
  EulerOrder3.YZX,
  EulerOrder3.XZY
];

describe('Quatr', () => {
  test('constructor defaults', () => {
    const a = new Quat();
    expect(a.x).toBe(0);
    expect(a.y).toBe(0);
    expect(a.z).toBe(0);
    expect(a.w).toBe(1);
  });

  test('constructor Values', () => {
    const b = new Quat(1, 2, 3, 4);
    expect(b.x).toBe(1);
    expect(b.y).toBe(2);
    expect(b.z).toBe(3);
    expect(b.w).toBe(4);
  });

  test('clone', () => {
    const b = new Quat(1, 2, 3, 4);
    const c = b.clone();
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
    expect(c.z).toBe(3);
    expect(c.w).toBe(4);
  });
});

describe('Quat-Euler3 ', () => {
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
