import { Vec3 } from './Vec3.js';

describe('Vec3', () => {
  test('constructor defaults', () => {
    const a = new Vec3();
    expect(a.r).toBe(0);
    expect(a.g).toBe(0);
    expect(a.b).toBe(0);
  });

  test('constructor values', () => {
    const b = new Vec3(1, 2, 3);
    expect(b.r).toBe(1);
    expect(b.g).toBe(2);
    expect(b.b).toBe(3);
  });
  test('clone', () => {
    const b = new Vec3(1, 2, 3);
    const c = b.clone();
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
    expect(c.z).toBe(3);
  });
  test('copy', () => {
    const b = new Vec3(1, 2, 3);
    const d = new Vec3().copy(b);
    expect(d.x).toBe(1);
    expect(d.y).toBe(2);
    expect(d.z).toBe(3);
  });
});
