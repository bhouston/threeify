import { Euler, EulerOrder } from "./Euler";
import { makeEulerFromQuaternion, makeEulerFromRotationMatrix4 } from "./Euler.Functions";
import { makeMatrix4RotationFromEuler } from "./Matrix4.Functions";
import { makeQuaternionFromEuler } from "./Quaternion.Functions";

const testOrders = [EulerOrder.XYZ, EulerOrder.YXZ, EulerOrder.ZXY, EulerOrder.ZYX, EulerOrder.YZX, EulerOrder.XZY];
const e0 = new Euler();
const eX = new Euler(1, 0, 0);
const eY = new Euler(0, 1, 0);
const eZ = new Euler(0, 0, 1);
const eXY = new Euler(1, 0.5, 0);
const eYZ = new Euler(0, 1, 0.5);
const eXZ = new Euler(0.5, 0, 1);
const eXYZ = new Euler(0.25, 0.5, 1);

const testValues = [e0, eX, eY, eZ, eXY, eYZ, eXZ, eXYZ];

function delta(a: Euler, b: Euler): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
}

describe("Euler", () => {
  test("constructor defaults", () => {
    const a = new Euler();
    expect(a.x).toBe(0);
    expect(a.y).toBe(0);
    expect(a.z).toBe(0);
    expect(a.order).toBe(EulerOrder.Default);
  });

  test("constructor values", () => {
    const b = new Euler(1, 2, 3, EulerOrder.ZXY);
    expect(b.x).toBe(1);
    expect(b.y).toBe(2);
    expect(b.z).toBe(3);
    expect(b.order).toBe(EulerOrder.ZXY);
  });

  test("clone", () => {
    const b = new Euler(1, 2, 3, EulerOrder.ZXY);
    const c = b.clone();
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
    expect(c.z).toBe(3);
    expect(c.order).toBe(EulerOrder.ZXY);
  });

  test("copy", () => {
    const b = new Euler(1, 2, 3, EulerOrder.ZXY);
    const d = new Euler().copy(b);
    expect(d.x).toBe(1);
    expect(d.y).toBe(2);
    expect(d.z).toBe(3);
    expect(d.order).toBe(EulerOrder.ZXY);
  });
});

describe("Euler-Quaternion", () => {
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

describe("Euler-Matrix4", () => {
  testValues.forEach((euler, ei) => {
    testOrders.forEach((order, oi) => {
      test(`e ${ei} order ${oi}`, () => {
        const e = euler.clone();
        e.order = order;
        const m = makeMatrix4RotationFromEuler(e);
        const e2 = makeEulerFromRotationMatrix4(m, e.order);
        expect(delta(e, e2)).toBeLessThan(0.000001);
        expect(e.order).toBe(e2.order);
      });
    });
  });
});
