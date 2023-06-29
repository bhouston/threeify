// a set of ts-jest unit tests that ensure the correct functionality of the class Mat3

import { Mat3 } from './Mat3.js';

describe('Mat3', () => {
  test('constructor', () => {
    const a = new Mat3();
    expect(a.elements[0]).toBe(1);
    expect(a.elements[1]).toBe(0);
    expect(a.elements[2]).toBe(0);
    expect(a.elements[3]).toBe(0);
    expect(a.elements[4]).toBe(1);
    expect(a.elements[5]).toBe(0);
    expect(a.elements[6]).toBe(0);
    expect(a.elements[7]).toBe(0);
    expect(a.elements[8]).toBe(1);
  });
  test('constructor values', () => {
    const b = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(b.elements[0]).toBe(1);
    expect(b.elements[1]).toBe(2);
    expect(b.elements[2]).toBe(3);
    expect(b.elements[3]).toBe(4);
    expect(b.elements[4]).toBe(5);
    expect(b.elements[5]).toBe(6);
    expect(b.elements[6]).toBe(7);
    expect(b.elements[7]).toBe(8);
    expect(b.elements[8]).toBe(9);
  });
  test('clone', () => {
    const b = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
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
  });
});
