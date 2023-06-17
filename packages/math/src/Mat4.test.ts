// a set of ts-jest unit tests that ensure the correct functionality of the class Mat4

import { Mat4 } from './Mat4';

describe('Mat4', () => {
  test('constructor', () => {
    const a = new Mat4();
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
    expect(a.elements[12]).toBe(0);
    expect(a.elements[13]).toBe(0);
    expect(a.elements[14]).toBe(0);
    expect(a.elements[15]).toBe(1);
  });
  test('constructor values', () => {
    const b = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    expect(b.elements[0]).toBe(1);
    expect(b.elements[1]).toBe(2);
    expect(b.elements[2]).toBe(3);
    expect(b.elements[3]).toBe(4);
    expect(b.elements[4]).toBe(5);
    expect(b.elements[5]).toBe(6);
    expect(b.elements[6]).toBe(7);
    expect(b.elements[7]).toBe(8);
    expect(b.elements[8]).toBe(9);
    expect(b.elements[9]).toBe(10);
    expect(b.elements[10]).toBe(11);
    expect(b.elements[11]).toBe(12);
    expect(b.elements[12]).toBe(13);
    expect(b.elements[13]).toBe(14);
    expect(b.elements[14]).toBe(15);
    expect(b.elements[15]).toBe(16);
  });
  test('clone', () => {
    const b = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const c = b.clone();
    expect(c.elements[0]).toBe(1);
    expect(c.elements[1]).toBe(2);
    expect(c.elements[2]).toBe(3);
    expect(c.elements[3]).toBe(4);
    expect(c.elements[4]).toBe(5);
    expect(c.elements[5]).toBe(6);
    expect(c.elements[6]).toBe(7);
    expect(c.elements[7]).toBe(8);
    expect(c.elements[8]).toBe(9);
    expect(c.elements[9]).toBe(10);
    expect(c.elements[10]).toBe(11);
    expect(c.elements[11]).toBe(12);
    expect(c.elements[12]).toBe(13);
    expect(c.elements[13]).toBe(14);
    expect(c.elements[14]).toBe(15);
    expect(c.elements[15]).toBe(16);
  });
});
