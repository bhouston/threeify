import { Vec4 } from './Vec4.js';

describe('Vector4', () => {
  test('constructor defaults', () => {
    const a = new Vec4();
    expect(a.x).toBe(0);
    expect(a.y).toBe(0);
    expect(a.z).toBe(0);
    expect(a.w).toBe(0);
  });

  test('constructor values', () => {
    const b = new Vec4(1, 2, 3, 4);
    expect(b.x).toBe(1);
    expect(b.y).toBe(2);
    expect(b.z).toBe(3);
    expect(b.w).toBe(4);
  });
  test('clone', () => {
    const b = new Vec4(1, 2, 3, 4);
    const c = b.clone();
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
    expect(c.z).toBe(3);
    expect(c.w).toBe(4);
  });
  test('copy', () => {
    const b = new Vec4(1, 2, 3, 4);
    const c = new Vec4();
    c.copy(b);
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
    expect(c.z).toBe(3);
    expect(c.w).toBe(4);
  });
});
