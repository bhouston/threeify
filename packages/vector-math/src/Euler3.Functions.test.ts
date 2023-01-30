import { Euler3, EulerOrder3 } from './Euler3';
import {
  euler3Delta,
  mat3ToEuler3,
  mat4ToEuler3,
  quatToEuler3
} from './Euler3.Functions';
import { Mat3 } from './Mat3';
import { Mat4 } from './Mat4';
import { Quat } from './Quat';

const orders = [
  EulerOrder3.XYZ,
  EulerOrder3.XZY,
  EulerOrder3.YXZ,
  EulerOrder3.YZX,
  EulerOrder3.ZXY,
  EulerOrder3.ZYX
];
describe('Euler Functions', () => {
  test('euler3Delta', () => {
    const a = new Euler3(1, 2, 3);
    const b = new Euler3(4, 5, 6);
    const c = euler3Delta(a, b);
    expect(c).toBe(9);
  });

  describe('mat4ToEuler3', () => {
    const a = new Mat4();

    orders.forEach((order) => {
      test(`(0,0,0,${order})`, () => {
        const b = mat4ToEuler3(a, order);
        expect(euler3Delta(b, new Euler3())).toBeCloseTo(0);
      });
    });
  });

  describe('mat3ToEuler3', () => {
    const a = new Mat3();
    orders.forEach((order) => {
      test(`(0,0,0,${order})`, () => {
        const b = mat3ToEuler3(a, order);
        expect(euler3Delta(b, new Euler3())).toBeCloseTo(0);
      });
    });
  });

  describe('quatToEuler3', () => {
    const a = new Quat();
    orders.forEach((order) => {
      test(`(0,0,0,${order})`, () => {
        const b = quatToEuler3(a, order);
        expect(euler3Delta(b, new Euler3())).toBeCloseTo(0);
      });
    });
  });
});
