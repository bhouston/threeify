// a set of ts-jest unit tests that ensure the correct functionality of the Mat4 function helpers

import { mat4ToMat3 } from './Mat3.Functions.js';
import {
  mat4Add,
  mat4Equals,
  mat4Identity,
  mat4Multiply,
  mat4MultiplyByScalar,
  mat4Negate,
  mat4Subtract,
  mat4Transpose,
  scale3ToMat4,
  translation3ToMat4
} from './Mat4.Functions';
import { Mat4 } from './Mat4.js';
import { Vec3 } from './Vec3.js';

describe('Mat4 Functions', () => {
  test('mat4Identity', () => {
    const a = new Mat4([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
    const b = mat4Identity(a);
    expect(b.elements[0]).toBe(1);
    expect(b.elements[1]).toBe(0);
    expect(b.elements[2]).toBe(0);
    expect(b.elements[3]).toBe(0);
    expect(b.elements[4]).toBe(0);
    expect(b.elements[5]).toBe(1);
    expect(b.elements[6]).toBe(0);
    expect(b.elements[7]).toBe(0);
    expect(b.elements[8]).toBe(0);
    expect(b.elements[9]).toBe(0);
    expect(b.elements[10]).toBe(1);
    expect(b.elements[11]).toBe(0);
    expect(b.elements[12]).toBe(0);
    expect(b.elements[13]).toBe(0);
    expect(b.elements[14]).toBe(0);
    expect(b.elements[15]).toBe(1);
  });

  test('mat4ToMat3', () => {
    const a = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const b = mat4ToMat3(a);
    expect(b.elements[0]).toBe(1);
    expect(b.elements[1]).toBe(2);
    expect(b.elements[2]).toBe(3);
    expect(b.elements[3]).toBe(5);
    expect(b.elements[4]).toBe(6);
    expect(b.elements[5]).toBe(7);
    expect(b.elements[6]).toBe(9);
    expect(b.elements[7]).toBe(10);
    expect(b.elements[8]).toBe(11);
  });

  test('mat4Equals', () => {
    const a = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const b = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const c = new Mat4([2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    expect(mat4Equals(a, b)).toBe(true);
    expect(mat4Equals(a, c)).toBe(false);
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
    expect(a.elements[3]).toBe(1);
    expect(a.elements[4]).toBe(0);
    expect(a.elements[5]).toBe(1);
    expect(a.elements[6]).toBe(0);
    expect(a.elements[7]).toBe(2);
    expect(a.elements[8]).toBe(0);
    expect(a.elements[9]).toBe(0);
    expect(a.elements[10]).toBe(1);
    expect(a.elements[11]).toBe(3);
    expect(a.elements[12]).toBe(0);
    expect(a.elements[13]).toBe(0);
    expect(a.elements[14]).toBe(0);
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
});
