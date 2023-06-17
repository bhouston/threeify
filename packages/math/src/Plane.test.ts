import { Plane } from './Plane';
import { Vec3 } from './Vec3';

// test all functions on the Plane class
describe('Plane', () => {
  test('constructor', () => {
    const a = new Plane();
    expect(a.normal.x).toBe(0);
    expect(a.normal.y).toBe(0);
    expect(a.normal.z).toBe(-1);
    expect(a.constant).toBe(0);
  });

  test('getHashCode', () => {
    const a = new Plane();
    expect(a.getHashCode()).toBe(-109051904);
  });

  test('set', () => {
    const a = new Plane();
    a.set(new Vec3(1, 2, 3), 4);
    expect(a.normal.x).toBe(1);
    expect(a.normal.y).toBe(2);
    expect(a.normal.z).toBe(3);
    expect(a.constant).toBe(4);
  });

  test('clone', () => {
    const a = new Plane(new Vec3(1, 2, 3), 4);
    const b = a.clone();
    expect(b.normal.x).toBe(1);
    expect(b.normal.y).toBe(2);
    expect(b.normal.z).toBe(3);
    expect(b.constant).toBe(4);
  });
});
