import { Euler3, EulerOrder3 } from './Euler3';
import { mat4ToEuler3, quatToEuler3 } from './Euler3.Functions';
import { euler3ToMat4 } from './Mat4.Functions';
import { euler3ToQuat } from './Quat.Functions';

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
});

describe('Euler3-Quat', () => {
  testValues.forEach((euler, ei) => {
    testOrders.forEach((order, oi) => {
      test(`e ${ei} order ${oi}`, () => {
        const e = euler.clone();
        e.order = order;
        const q = euler3ToQuat(e);
        const e2 = quatToEuler3(q, e.order);
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
        const m = euler3ToMat4(e);
        const e2 = mat4ToEuler3(m, e.order);
        expect(delta(e, e2)).toBeLessThan(0.000001);
        expect(e.order).toBe(e2.order);
      });
    });
  });
});
