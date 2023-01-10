import { Vec3 } from './Vec3.js';

describe('Vec3', () => {
  test('constructor defaults', () => {
    const a = new Vec3();
    expect(a.x).toBe(0);
    expect(a.y).toBe(0);
    expect(a.z).toBe(0);
  });

  test('constructor values', () => {
    const b = new Vec3(1, 2, 3);
    expect(b.x).toBe(1);
    expect(b.y).toBe(2);
    expect(b.z).toBe(3);
  });

  test('clone', () => {
    const b = new Vec3(1, 2, 3);
    const c = b.clone();
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
    expect(c.z).toBe(3);
  });
});
