import {
  makeEulerFromQuaternion,
  makeEulerFromRotationMat4
} from './Euler3.Functions.js';
import { Euler3, EulerOrder3 } from './Euler3.js';
import { makeMat4RotationFromEuler } from './Mat4.Functions.js';
import { makeQuaternionFromEuler } from './Quaternion.Functions.js';

const testOrders = [
  EulerOrder3.XYZ,
  EulerOrder3.YXZ,
  EulerOrder3.ZXY,
  EulerOrder3.ZYX,
  EulerOrder3.YZX,
  EulerOrder3.XZY
];
const e0 = new Euler3();
const eX = new Euler3(1, 0, 0);
const eY = new Euler3(0, 1, 0);
const eZ = new Euler3(0, 0, 1);
const eXY = new Euler3(1, 0.5, 0);
const eYZ = new Euler3(0, 1, 0.5);
const eXZ = new Euler3(0.5, 0, 1);
const eXYZ = new Euler3(0.25, 0.5, 1);

const testValues = [e0, eX, eY, eZ, eXY, eYZ, eXZ, eXYZ];

function delta(a: Euler3, b: Euler3): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
}

describe('Euler3', () => {
  test('constructor defaults', () => {
    const a = new Euler3();
    expect(a.x).toBe(0);
    expect(a.y).toBe(0);
    expect(a.z).toBe(0);
    expect(a.order).toBe(EulerOrder3.Default);
  });

  test('constructor values', () => {
    const b = new Euler3(1, 2, 3, EulerOrder3.ZXY);
    expect(b.x).toBe(1);
    expect(b.y).toBe(2);
    expect(b.z).toBe(3);
    expect(b.order).toBe(EulerOrder3.ZXY);
  });

  test('clone', () => {
    const b = new Euler3(1, 2, 3, EulerOrder3.ZXY);
    const c = b.clone();
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
    expect(c.z).toBe(3);
    expect(c.order).toBe(EulerOrder3.ZXY);
  });

  test('copy', () => {
    const b = new Euler3(1, 2, 3, EulerOrder3.ZXY);
    const d = new Euler3().copy(b);
    expect(d.x).toBe(1);
    expect(d.y).toBe(2);
    expect(d.z).toBe(3);
    expect(d.order).toBe(EulerOrder3.ZXY);
  });
});

describe('Euler3-Quaternion', () => {
  testValues.forEach((euler, ei) => {
    testOrders.forEach((order, oi) => {
      test(`e ${ei} order ${oi}`, () => {
        const e = euler.clone();
        e.order = order;
        const q = makeQuaternionFromEuler(e);
        const e2 = makeEulerFromQuaternion(q, e.order);
        expect(delta(e, e2)).toBeLessThan(0.000001);
        expect(e.order).toBe(e2.order);
      });
    });
  });
});

describe('Euler3-Mat4', () => {
  testValues.forEach((euler, ei) => {
    testOrders.forEach((order, oi) => {
      test(`e ${ei} order ${oi}`, () => {
        const e = euler.clone();
        e.order = order;
        const m = makeMat4RotationFromEuler(e);
        const e2 = makeEulerFromRotationMat4(m, e.order);
        expect(delta(e, e2)).toBeLessThan(0.000001);
        expect(e.order).toBe(e2.order);
      });
    });
  });
});
