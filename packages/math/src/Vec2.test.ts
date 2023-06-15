import { Vec2 } from './Vec2';

describe('Vec2', () => {
  test('constructor defaults', () => {
    const a = new Vec2();
    expect(a.x).toBe(0);
    expect(a.y).toBe(0);
  });

  test('constructor values', () => {
    const b = new Vec2(1, 2);
    expect(b.x).toBe(1);
    expect(b.y).toBe(2);
  });

  test('clone', () => {
    const b = new Vec2(1, 2);
    const c = b.clone();
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
  });

  test('copy', () => {
    const b = new Vec2(1, 2);
    const c = new Vec2();
    c.copy(b);
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
  });
});
