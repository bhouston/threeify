import { Ray3 } from './Ray3.js';
import { Vec3 } from './Vec3.js';

// test all functions on the Ray3 class
describe('Ray3', () => {
  test('constructor', () => {
    const a = new Ray3();
    expect(a.origin.x).toBe(0);
    expect(a.origin.y).toBe(0);
    expect(a.origin.z).toBe(0);
    expect(a.direction.x).toBe(0);
    expect(a.direction.y).toBe(0);
    expect(a.direction.z).toBe(-1);
  });

  test('getHashCode', () => {
    const a = new Ray3();
    expect(a.getHashCode()).toBe(-830406656);
  });

  test('set', () => {
    const a = new Ray3();
    a.set(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    expect(a.origin.x).toBe(1);
    expect(a.origin.y).toBe(2);
    expect(a.origin.z).toBe(3);
    expect(a.direction.x).toBe(4);
    expect(a.direction.y).toBe(5);
    expect(a.direction.z).toBe(6);
  });

  test('clone', () => {
    const a = new Ray3();
    a.set(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    const b = a.clone();
    expect(b.origin.x).toBe(1);
    expect(b.origin.y).toBe(2);
    expect(b.origin.z).toBe(3);
    expect(b.direction.x).toBe(4);
    expect(b.direction.y).toBe(5);
    expect(b.direction.z).toBe(6);
  });
});
