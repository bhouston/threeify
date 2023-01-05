import { makeEulerFromQuaternion } from './Euler3.Functions.js';
import { EulerOrder3 } from './Euler3.js';
import { makeMatrix4RotationFromQuaternion } from './Matrix4.Functions.js';
import {
  makeQuaternionFromEuler,
  makeQuaternionFromRotationMatrix4
} from './Quaternion.Functions.js';
import { Quaternion } from './Quaternion.js';

const qX = new Quaternion(1, 0, 0).normalize();
const qY = new Quaternion(0, 1, 0).normalize();
const qZ = new Quaternion(0, 0, 1).normalize();
const qW = new Quaternion(0, 0, 0, 1).normalize();
const qXY = new Quaternion(1, 0.5, 0).normalize();
const qYZ = new Quaternion(0, 1, 0.5).normalize();
const qXZ = new Quaternion(0.5, 0, 1).normalize();
const qXYZ = new Quaternion(0.25, 0.5, 1).normalize();
const qXYW = new Quaternion(1, 0.5, 0, 0.25).normalize();
const qYZW = new Quaternion(0, 1, 0.5, 0.25).normalize();
const qXZW = new Quaternion(0.5, 0, 1, 0.25).normalize();

const testValues = [qX, qY, qZ, qW, qXY, qYZ, qXZ, qXYZ, qXYW, qYZW, qXZW];
const testOrders = [
  EulerOrder3.XYZ,
  EulerOrder3.YXZ,
  EulerOrder3.ZXY,
  EulerOrder3.ZYX,
  EulerOrder3.YZX,
  EulerOrder3.XZY
];

describe('Quaternionr', () => {
  test('constructor defaults', () => {
    const a = new Quaternion();
    expect(a.x).toBe(0);
    expect(a.y).toBe(0);
    expect(a.z).toBe(0);
    expect(a.w).toBe(1);
  });

  test('constructor Values', () => {
    const b = new Quaternion(1, 2, 3, 4);
    expect(b.x).toBe(1);
    expect(b.y).toBe(2);
    expect(b.z).toBe(3);
    expect(b.w).toBe(4);
  });

  test('clone', () => {
    const b = new Quaternion(1, 2, 3, 4);
    const c = b.clone();
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
    expect(c.z).toBe(3);
    expect(c.w).toBe(4);
  });

  test('copy', () => {
    const b = new Quaternion(1, 2, 3, 4);
    const d = new Quaternion().copy(b);
    expect(d.x).toBe(1);
    expect(d.y).toBe(2);
    expect(d.z).toBe(3);
    expect(d.w).toBe(4);
  });
});

describe('Quaternion-Euler3 ', () => {
  testValues.forEach((q, qi) => {
    testOrders.forEach((eulerOrder, ei) => {
      test(`q${qi} order ${ei}`, () => {
        const e = makeEulerFromQuaternion(q, eulerOrder);
        const q2 = makeQuaternionFromEuler(e);
        expect(q2.clone().sub(q).length()).toBeLessThan(0.000001);
      });
    });
  });
});

describe('Quaternion-Matrix4', () => {
  testValues.forEach((q, qi) => {
    test(`q ${qi}`, () => {
      const m = makeMatrix4RotationFromQuaternion(q);
      const q2 = makeQuaternionFromRotationMatrix4(m);
      expect(q2.clone().sub(q).length()).toBeLessThan(0.000001);
    });
  });
});
