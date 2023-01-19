// a set of ts-jest unit tests that ensure the correct functionality of the Mat4 function helpers

import { EPSILON } from './Functions.js';
import { mat3Equals, mat4ToMat3 } from './Mat3.Functions.js';
import { Mat3 } from './Mat3.js';
import {
  basis3ToMat4,
  mat4Add,
  mat4Compose,
  mat4Decompose,
  mat4Delta,
  mat4Equals,
  mat4Identity,
  mat4Multiply,
  mat4MultiplyByScalar,
  mat4Negate,
  mat4Orthographic,
  mat4Perspective,
  mat4Subtract,
  mat4ToBasis3,
  mat4Transpose,
  mat4Zero,
  scale3ToMat4,
  translation3ToMat4
} from './Mat4.Functions';
import { Mat4 } from './Mat4.js';
import { quatNormalize } from './Quat.Functions.js';
import { Quat } from './Quat.js';
import { mat4TransformVec3 } from './Vec3.Functions.js';
import { Vec3 } from './Vec3.js';

describe('Mat4 Functions', () => {
  test('mat4Zero', () => {
    const a = new Mat4([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
    const b = mat4Zero(a);
    const c = new Mat4([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(mat4Equals(b, c)).toBe(true);
  });

  test('mat4Identity', () => {
    const a = new Mat4([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
    const b = mat4Identity(a);
    const c = new Mat4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    expect(mat4Equals(b, c)).toBe(true);
  });

  test('mat4ToMat3', () => {
    const a = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const b = mat4ToMat3(a);
    const c = new Mat3([1, 2, 3, 5, 6, 7, 9, 10, 11]);
    expect(mat3Equals(b, c)).toBe(true);
  });

  test('mat4Equals', () => {
    const a = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const b = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const c = new Mat4([2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    expect(mat4Equals(a, b)).toBe(true);
    expect(mat4Equals(a, c)).toBe(false);
  });

  test('basis3ToMat4/mat4ToBasis3', () => {
    const identityBasis = [
      new Vec3(1, 0, 0),
      new Vec3(0, 1, 0),
      new Vec3(0, 0, 1)
    ];
    const a = basis3ToMat4(
      identityBasis[0],
      identityBasis[1],
      identityBasis[2]
    );
    const identity = new Mat4();
    expect(mat4Delta(a, identity)).toBe(0);

    const testBases = [
      new Vec3(0, 1, 0),
      new Vec3(-1, 0, 0),
      new Vec3(0, 0, 1)
    ];

    const b = basis3ToMat4(testBases[0], testBases[1], testBases[2]);
    const outBasis = [new Vec3(), new Vec3(), new Vec3()];

    mat4ToBasis3(b, outBasis[0], outBasis[1], outBasis[2]);
    // check what goes in, is what comes out.
    for (let j = 0; j < outBasis.length; j++) {
      expect(testBases[j].x).toBeCloseTo(outBasis[j].x);
      expect(testBases[j].y).toBeCloseTo(outBasis[j].y);
      expect(testBases[j].z).toBeCloseTo(outBasis[j].z);
    }

    // get the basis out the hard war
    for (let j = 0; j < identityBasis.length; j++) {
      outBasis[j].copy(identityBasis[j]);
      mat4TransformVec3(b, outBasis[j], outBasis[j]);
    }

    // did the multiply method of basis extraction work?
    for (let j = 0; j < outBasis.length; j++) {
      expect(testBases[j].x).toBeCloseTo(outBasis[j].x);
      expect(testBases[j].y).toBeCloseTo(outBasis[j].y);
      expect(testBases[j].z).toBeCloseTo(outBasis[j].z);
    }
  });

  test('mat4Add', () => {
    const a = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const b = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const c = mat4Add(a, b);
    expect(c.elements[0]).toBe(2);
    expect(c.elements[1]).toBe(4);
    expect(c.elements[2]).toBe(6);
    expect(c.elements[3]).toBe(8);
    expect(c.elements[4]).toBe(10);
    expect(c.elements[5]).toBe(12);
    expect(c.elements[6]).toBe(14);
    expect(c.elements[7]).toBe(16);
    expect(c.elements[8]).toBe(18);
    expect(c.elements[9]).toBe(20);
    expect(c.elements[10]).toBe(22);
    expect(c.elements[11]).toBe(24);
    expect(c.elements[12]).toBe(26);
    expect(c.elements[13]).toBe(28);
    expect(c.elements[14]).toBe(30);
    expect(c.elements[15]).toBe(32);
  });

  test('mat4Subtract', () => {
    const a = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const b = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const c = mat4Subtract(a, b);
    expect(c.elements[0]).toBe(0);
    expect(c.elements[1]).toBe(0);
    expect(c.elements[2]).toBe(0);
    expect(c.elements[3]).toBe(0);
    expect(c.elements[4]).toBe(0);
    expect(c.elements[5]).toBe(0);
    expect(c.elements[6]).toBe(0);
    expect(c.elements[7]).toBe(0);
    expect(c.elements[8]).toBe(0);
    expect(c.elements[9]).toBe(0);
    expect(c.elements[10]).toBe(0);
    expect(c.elements[11]).toBe(0);
    expect(c.elements[12]).toBe(0);
    expect(c.elements[13]).toBe(0);
    expect(c.elements[14]).toBe(0);
    expect(c.elements[15]).toBe(0);
  });

  test('mat4MultiplyByScalar', () => {
    const a = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const b = mat4MultiplyByScalar(a, 2);
    expect(b.elements[0]).toBe(2);
    expect(b.elements[1]).toBe(4);
    expect(b.elements[2]).toBe(6);
    expect(b.elements[3]).toBe(8);
    expect(b.elements[4]).toBe(10);
    expect(b.elements[5]).toBe(12);
    expect(b.elements[6]).toBe(14);
    expect(b.elements[7]).toBe(16);
    expect(b.elements[8]).toBe(18);
    expect(b.elements[9]).toBe(20);
    expect(b.elements[10]).toBe(22);
    expect(b.elements[11]).toBe(24);
    expect(b.elements[12]).toBe(26);
    expect(b.elements[13]).toBe(28);
    expect(b.elements[14]).toBe(30);
    expect(b.elements[15]).toBe(32);
  });

  test('mat4Negate', () => {
    const a = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const b = mat4Negate(a);
    expect(b.elements[0]).toBe(-1);
    expect(b.elements[1]).toBe(-2);
    expect(b.elements[2]).toBe(-3);
    expect(b.elements[3]).toBe(-4);
    expect(b.elements[4]).toBe(-5);
    expect(b.elements[5]).toBe(-6);
    expect(b.elements[6]).toBe(-7);
    expect(b.elements[7]).toBe(-8);
    expect(b.elements[8]).toBe(-9);
    expect(b.elements[9]).toBe(-10);
    expect(b.elements[10]).toBe(-11);
    expect(b.elements[11]).toBe(-12);
    expect(b.elements[12]).toBe(-13);
    expect(b.elements[13]).toBe(-14);
    expect(b.elements[14]).toBe(-15);
    expect(b.elements[15]).toBe(-16);
  });

  test('mat4Multiply', () => {
    const a = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const b = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const c = mat4Multiply(a, b);
    expect(c.elements[0]).toBe(90);
    expect(c.elements[1]).toBe(100);
    expect(c.elements[2]).toBe(110);
    expect(c.elements[3]).toBe(120);
    expect(c.elements[4]).toBe(202);
    expect(c.elements[5]).toBe(228);
    expect(c.elements[6]).toBe(254);
    expect(c.elements[7]).toBe(280);
    expect(c.elements[8]).toBe(314);
    expect(c.elements[9]).toBe(356);
    expect(c.elements[10]).toBe(398);
    expect(c.elements[11]).toBe(440);
    expect(c.elements[12]).toBe(426);
    expect(c.elements[13]).toBe(484);
    expect(c.elements[14]).toBe(542);
    expect(c.elements[15]).toBe(600);
  });

  test('mat4Transpose', () => {
    const a = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const b = mat4Transpose(a);
    expect(b.elements[0]).toBe(1);
    expect(b.elements[1]).toBe(5);
    expect(b.elements[2]).toBe(9);
    expect(b.elements[3]).toBe(13);
    expect(b.elements[4]).toBe(2);
    expect(b.elements[5]).toBe(6);
    expect(b.elements[6]).toBe(10);
    expect(b.elements[7]).toBe(14);
    expect(b.elements[8]).toBe(3);
    expect(b.elements[9]).toBe(7);
    expect(b.elements[10]).toBe(11);
    expect(b.elements[11]).toBe(15);
    expect(b.elements[12]).toBe(4);
    expect(b.elements[13]).toBe(8);
    expect(b.elements[14]).toBe(12);
    expect(b.elements[15]).toBe(16);
  });

  test('translation3ToMat4', () => {
    const a = translation3ToMat4(new Vec3(1, 2, 3));
    expect(a.elements[0]).toBe(1);
    expect(a.elements[1]).toBe(0);
    expect(a.elements[2]).toBe(0);
    expect(a.elements[3]).toBe(0);
    expect(a.elements[4]).toBe(0);
    expect(a.elements[5]).toBe(1);
    expect(a.elements[6]).toBe(0);
    expect(a.elements[7]).toBe(0);
    expect(a.elements[8]).toBe(0);
    expect(a.elements[9]).toBe(0);
    expect(a.elements[10]).toBe(1);
    expect(a.elements[11]).toBe(0);
    expect(a.elements[12]).toBe(1);
    expect(a.elements[13]).toBe(2);
    expect(a.elements[14]).toBe(3);
    expect(a.elements[15]).toBe(1);
  });

  test('scale3ToMat4', () => {
    const a = scale3ToMat4(new Vec3(1, 2, 3));
    expect(a.elements[0]).toBe(1);
    expect(a.elements[1]).toBe(0);
    expect(a.elements[2]).toBe(0);
    expect(a.elements[3]).toBe(0);
    expect(a.elements[4]).toBe(0);
    expect(a.elements[5]).toBe(2);
    expect(a.elements[6]).toBe(0);
    expect(a.elements[7]).toBe(0);
    expect(a.elements[8]).toBe(0);
    expect(a.elements[9]).toBe(0);
    expect(a.elements[10]).toBe(3);
    expect(a.elements[11]).toBe(0);
    expect(a.elements[12]).toBe(0);
    expect(a.elements[13]).toBe(0);
    expect(a.elements[14]).toBe(0);
    expect(a.elements[15]).toBe(1);
  });

  // compose the matrix and then decompose the matrix, the results hsould be the same within the EPLISON tolerance
  describe('mat4Compose', () => {
    const translation = new Vec3(1, 2, 3);
    const rotation = quatNormalize(new Quat(1, 2, -3, 4));
    const scale = new Vec3(1, 2, 3);
    const m = mat4Compose(translation, rotation, scale);

    test('explicit compose', () => {
      const m2 = new Mat4([
        0.13333333333333353, -0.6666666666666666, -0.7333333333333332, 0,
        1.8666666666666665, 0.666666666666667, -0.2666666666666667, 0,
        0.9999999999999998, -1.9999999999999996, 2, 0, 1, 2, 3, 1
      ]);
      expect(m.elements[0]).toBeCloseTo(m2.elements[0], EPSILON);
      expect(m.elements[1]).toBeCloseTo(m2.elements[1], EPSILON);
      expect(m.elements[2]).toBeCloseTo(m2.elements[2], EPSILON);
      expect(m.elements[3]).toBeCloseTo(m2.elements[3], EPSILON);
      expect(m.elements[4]).toBeCloseTo(m2.elements[4], EPSILON);
      expect(m.elements[5]).toBeCloseTo(m2.elements[5], EPSILON);
      expect(m.elements[6]).toBeCloseTo(m2.elements[6], EPSILON);
      expect(m.elements[7]).toBeCloseTo(m2.elements[7], EPSILON);
      expect(m.elements[8]).toBeCloseTo(m2.elements[8], EPSILON);
      expect(m.elements[9]).toBeCloseTo(m2.elements[9], EPSILON);
      expect(m.elements[10]).toBeCloseTo(m2.elements[10], EPSILON);
      expect(m.elements[11]).toBeCloseTo(m2.elements[11], EPSILON);
      expect(m.elements[12]).toBeCloseTo(m2.elements[12], EPSILON);
      expect(m.elements[13]).toBeCloseTo(m2.elements[13], EPSILON);
      expect(m.elements[14]).toBeCloseTo(m2.elements[14], EPSILON);
      expect(m.elements[15]).toBeCloseTo(m2.elements[15], EPSILON);
    });
    test('mat4Compose/mat4Decompose', () => {
      const {
        translation: translation2,
        rotation: rotation2,
        scale: scale2
      } = mat4Decompose(m);
      expect(translation2.x).toBeCloseTo(translation.x, EPSILON);
      expect(translation2.y).toBeCloseTo(translation.y, EPSILON);
      expect(translation2.z).toBeCloseTo(translation.z, EPSILON);
      expect(rotation2.x).toBeCloseTo(rotation.x, EPSILON);
      expect(rotation2.y).toBeCloseTo(rotation.y, EPSILON);
      expect(rotation2.z).toBeCloseTo(rotation.z, EPSILON);
      expect(rotation2.w).toBeCloseTo(rotation.w, EPSILON);
      expect(scale2.x).toBeCloseTo(scale.x, EPSILON);
      expect(scale2.y).toBeCloseTo(scale.y, EPSILON);
      expect(scale2.z).toBeCloseTo(scale.z, EPSILON);
    });
  });

  test('mat4Perspective', () => {
    const m = mat4Perspective(-1, 1, -1, 1, 1, 100);
    const m2 = new Mat4([
      1,
      0,
      0,
      0,
      0,
      -1,
      0,
      0,
      0,
      0,
      -101 / 99,
      -1,
      0,
      0,
      -200 / 99,
      0
    ]);

    expect(m.elements[0]).toBeCloseTo(m2.elements[0], EPSILON);
    expect(m.elements[1]).toBeCloseTo(m2.elements[1], EPSILON);
    expect(m.elements[2]).toBeCloseTo(m2.elements[2], EPSILON);
    expect(m.elements[3]).toBeCloseTo(m2.elements[3], EPSILON);
    expect(m.elements[4]).toBeCloseTo(m2.elements[4], EPSILON);
    expect(m.elements[5]).toBeCloseTo(m2.elements[5], EPSILON);
    expect(m.elements[6]).toBeCloseTo(m2.elements[6], EPSILON);
    expect(m.elements[7]).toBeCloseTo(m2.elements[7], EPSILON);
    expect(m.elements[8]).toBeCloseTo(m2.elements[8], EPSILON);
    expect(m.elements[9]).toBeCloseTo(m2.elements[9], EPSILON);
    expect(m.elements[10]).toBeCloseTo(m2.elements[10], EPSILON);
    expect(m.elements[11]).toBeCloseTo(m2.elements[11], EPSILON);
    expect(m.elements[12]).toBeCloseTo(m2.elements[12], EPSILON);
    expect(m.elements[13]).toBeCloseTo(m2.elements[13], EPSILON);
    expect(m.elements[14]).toBeCloseTo(m2.elements[14], EPSILON);
    expect(m.elements[15]).toBeCloseTo(m2.elements[15], EPSILON);
  });
  test('mat4Orthographic', () => {
    const m = mat4Orthographic(-1, 1, -1, 1, 1, 100);
    const m2 = new Mat4([
      1,
      0,
      0,
      0,
      0,
      -1,
      0,
      0,
      0,
      0,
      -2 / 99,
      0,
      0,
      0,
      -101 / 99,
      1
    ]);

    expect(m.elements[0]).toBeCloseTo(m2.elements[0], EPSILON);
    expect(m.elements[1]).toBeCloseTo(m2.elements[1], EPSILON);
    expect(m.elements[2]).toBeCloseTo(m2.elements[2], EPSILON);
    expect(m.elements[3]).toBeCloseTo(m2.elements[3], EPSILON);
    expect(m.elements[4]).toBeCloseTo(m2.elements[4], EPSILON);
    expect(m.elements[5]).toBeCloseTo(m2.elements[5], EPSILON);
    expect(m.elements[6]).toBeCloseTo(m2.elements[6], EPSILON);
    expect(m.elements[7]).toBeCloseTo(m2.elements[7], EPSILON);
    expect(m.elements[8]).toBeCloseTo(m2.elements[8], EPSILON);
    expect(m.elements[9]).toBeCloseTo(m2.elements[9], EPSILON);
    expect(m.elements[10]).toBeCloseTo(m2.elements[10], EPSILON);
    expect(m.elements[11]).toBeCloseTo(m2.elements[11], EPSILON);
    expect(m.elements[12]).toBeCloseTo(m2.elements[12], EPSILON);
    expect(m.elements[13]).toBeCloseTo(m2.elements[13], EPSILON);
    expect(m.elements[14]).toBeCloseTo(m2.elements[14], EPSILON);
    expect(m.elements[15]).toBeCloseTo(m2.elements[15], EPSILON);
  });
});
