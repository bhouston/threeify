import { Color3 } from './Color3';

describe('Color3', () => {
  test('constructor defaults', () => {
    const a = new Color3();
    expect(a.r).toBe(0);
    expect(a.g).toBe(0);
    expect(a.b).toBe(0);
  });

  test('constructor values', () => {
    const b = new Color3(1, 2, 3);
    expect(b.r).toBe(1);
    expect(b.g).toBe(2);
    expect(b.b).toBe(3);
  });
  test('clone', () => {
    const b = new Color3(1, 2, 3);
    const c = b.clone();
    expect(c.r).toBe(1);
    expect(c.g).toBe(2);
    expect(c.b).toBe(3);
  });
  test('copy', () => {
    const b = new Color3(1, 2, 3);
    const c = new Color3();
    c.copy(b);
    expect(c.r).toBe(1);
    expect(c.g).toBe(2);
    expect(c.b).toBe(3);
  });
});
