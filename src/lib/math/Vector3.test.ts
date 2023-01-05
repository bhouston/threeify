import { Vector3 } from './Vector3.js';

describe('Vector3', () => {
  test('constructor defaults', () => {
    const a = new Vector3();
    expect(a.r).toBe(0);
    expect(a.g).toBe(0);
    expect(a.b).toBe(0);
  });

  test('constructor values', () => {
    const b = new Vector3(1, 2, 3);
    expect(b.r).toBe(1);
    expect(b.g).toBe(2);
    expect(b.b).toBe(3);
  });
  test('clone', () => {
    const b = new Vector3(1, 2, 3);
    const c = b.clone();
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
    expect(c.z).toBe(3);
  });
  test('copy', () => {
    const b = new Vector3(1, 2, 3);
    const d = new Vector3().copy(b);
    expect(d.x).toBe(1);
    expect(d.y).toBe(2);
    expect(d.z).toBe(3);
  });
});
