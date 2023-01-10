import { Mat3 } from './Mat3';
import { mat3ToMat4 } from './Mat4.Functions';

describe('Mat3 Functions', () => {
  test('mat3ToMat4', () => {
    const a = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = mat3ToMat4(a);
    expect(b.elements[0]).toBe(1);
    expect(b.elements[1]).toBe(2);
    expect(b.elements[2]).toBe(3);
    expect(b.elements[3]).toBe(0);
    expect(b.elements[4]).toBe(4);
    expect(b.elements[5]).toBe(5);
    expect(b.elements[6]).toBe(6);
    expect(b.elements[7]).toBe(0);
    expect(b.elements[8]).toBe(7);
    expect(b.elements[9]).toBe(8);
    expect(b.elements[10]).toBe(9);
    expect(b.elements[11]).toBe(0);
    expect(b.elements[12]).toBe(0);
    expect(b.elements[13]).toBe(0);
    expect(b.elements[14]).toBe(0);
    expect(b.elements[15]).toBe(1);
  });
});
