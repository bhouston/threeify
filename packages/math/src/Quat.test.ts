import { Quat } from './Quat';

describe('Quat', () => {
  test('constructor defaults', () => {
    const a = new Quat();
    expect(a.x).toBe(0);
    expect(a.y).toBe(0);
    expect(a.z).toBe(0);
    expect(a.w).toBe(1);
  });

  test('constructor Values', () => {
    const b = new Quat(1, 2, 3, 4);
    expect(b.x).toBe(1);
    expect(b.y).toBe(2);
    expect(b.z).toBe(3);
    expect(b.w).toBe(4);
  });

  test('clone', () => {
    const b = new Quat(1, 2, 3, 4);
    const c = b.clone();
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
    expect(c.z).toBe(3);
    expect(c.w).toBe(4);
  });
});
