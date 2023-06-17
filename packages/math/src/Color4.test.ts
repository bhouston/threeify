import { Color4 } from './Color4';

describe('Color4', () => {
  test('constructor defaults', () => {
    const a = new Color4();
    expect(a.r).toBe(0);
    expect(a.g).toBe(0);
    expect(a.b).toBe(0);
    expect(a.a).toBe(0);
  });

  test('constructor values', () => {
    const b = new Color4(1, 2, 3, 4);
    expect(b.r).toBe(1);
    expect(b.g).toBe(2);
    expect(b.b).toBe(3);
    expect(b.a).toBe(4);
  });
  test('clone', () => {
    const b = new Color4(1, 2, 3, 4);
    const c = b.clone();
    expect(c.r).toBe(1);
    expect(c.g).toBe(2);
    expect(c.b).toBe(3);
    expect(c.a).toBe(4);
  });
  test('copy', () => {
    const b = new Color4(1, 2, 3, 4);
    const c = new Color4();
    c.copy(b);
    expect(c.r).toBe(1);
    expect(c.g).toBe(2);
    expect(c.b).toBe(3);
    expect(c.a).toBe(4);
  });
});
