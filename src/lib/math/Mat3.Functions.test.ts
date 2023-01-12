import { Mat3 } from './Mat3';
import {
  basis3ToMat3,
  mat3Add,
  mat3Delta,
  mat3Equals,
  mat3Identity,
  mat3Multiply,
  mat3MultiplyByScalar,
  mat3Negate,
  mat3Subtract,
  mat3ToBasis3,
  mat3TransformPoint3,
  mat3Zero
} from './Mat3.Functions';
import { Mat4 } from './Mat4';
import { mat3ToMat4, mat4Equals } from './Mat4.Functions';
import { Vec3 } from './Vec3';

describe('Mat3 Functions', () => {
  test('mat3Zero', () => {
    const a = new Mat3([2, 2, 2, 2, 2, 2, 2, 2, 2]);
    const b = mat3Zero(a);
    const c = new Mat3([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(mat3Equals(b, c)).toBe(true);
  });

  test('mat3Identity', () => {
    const a = new Mat3([2, 2, 2, 2, 2, 2, 2, 2, 2]);
    const b = mat3Identity(a);
    const c = new Mat3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    expect(mat3Equals(b, c)).toBe(true);
  });

  test('mat3ToMat4', () => {
    const a = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = mat3ToMat4(a);
    const c = new Mat4([1, 2, 3, 0, 4, 5, 6, 0, 7, 8, 9, 0, 0, 0, 0, 1]);
    expect(mat4Equals(b, c)).toBe(true);
  });

  test('mat3Equals', () => {
    const a = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const c = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 10]);
    expect(mat3Equals(a, b)).toBe(true);
    expect(mat3Equals(a, c)).toBe(false);
  });

  test('basis3ToMat3/mat3ToBasis3', () => {
    const identityBasis = [
      new Vec3(1, 0, 0),
      new Vec3(0, 1, 0),
      new Vec3(0, 0, 1)
    ];
    const a = basis3ToMat3(
      identityBasis[0],
      identityBasis[1],
      identityBasis[2]
    );
    const identity = new Mat3();
    expect(mat3Delta(a, identity)).toBe(0);

    const testBases = [
      new Vec3(0, 2, 0),
      new Vec3(-1, 0, 0),
      new Vec3(0, 0, 3)
    ];

    const b = basis3ToMat3(testBases[0], testBases[1], testBases[2]);
    const outBasis = [new Vec3(), new Vec3(), new Vec3()];

    mat3ToBasis3(b, outBasis[0], outBasis[1], outBasis[2]);
    // check what goes in, is what comes out.
    for (let j = 0; j < outBasis.length; j++) {
      expect(testBases[j].x).toBeCloseTo(outBasis[j].x);
      expect(testBases[j].y).toBeCloseTo(outBasis[j].y);
      expect(testBases[j].z).toBeCloseTo(outBasis[j].z);
    }

    // get the basis out the hard war
    for (let j = 0; j < identityBasis.length; j++) {
      outBasis[j].copy(identityBasis[j]);
      mat3TransformPoint3(b, outBasis[j], outBasis[j]);
    }

    // did the multiply method of basis extraction work?
    for (let j = 0; j < outBasis.length; j++) {
      expect(testBases[j].x).toBeCloseTo(outBasis[j].x);
      expect(testBases[j].y).toBeCloseTo(outBasis[j].y);
      expect(testBases[j].z).toBeCloseTo(outBasis[j].z);
    }
  });

  test('mat3Add', () => {
    const a = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const c = new Mat3([2, 4, 6, 8, 10, 12, 14, 16, 18]);
    const d = mat3Add(a, b);
    expect(mat3Equals(c, d)).toBe(true);
  });

  test('mat3Subtract', () => {
    const a = new Mat3([2, 4, 6, 8, 10, 12, 14, 16, 18]);
    const b = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const c = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const d = new Mat3();
    const e = mat3Subtract(a, b, d);
    expect(mat3Equals(c, e)).toBe(true);
  });

  test('mat3MultiplyByScalar', () => {
    const a = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = new Mat3([2, 4, 6, 8, 10, 12, 14, 16, 18]);
    const c = 2;
    const d = mat3MultiplyByScalar(a, c);
    expect(mat3Equals(b, d)).toBe(true);
  });

  test('mat3Negate', () => {
    const a = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = new Mat3([-1, -2, -3, -4, -5, -6, -7, -8, -9]);
    const d = mat3Negate(a);
    expect(mat3Equals(b, d)).toBe(true);
  });

  test('mat3Multiply', () => {
    const a = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const c = new Mat3([30, 36, 42, 66, 81, 96, 102, 126, 150]);
    const d = new Mat3();
    const e = mat3Multiply(a, b, d);
    expect(mat3Equals(c, e)).toBe(true);
  });
});
