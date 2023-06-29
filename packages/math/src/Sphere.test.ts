import { Sphere } from './Sphere.js';
import { Vec3 } from './Vec3.js';

describe('Sphere', () => {
  test('constructor defaults', () => {
    const a = new Sphere();
    expect(a.center.x).toBe(0);
    expect(a.center.y).toBe(0);
    expect(a.center.z).toBe(0);
    expect(a.radius).toBe(-1);
  });

  test('constructor values', () => {
    const b = new Sphere(new Vec3(1, 2, 3), 4);
    expect(b.center.x).toBe(1);
    expect(b.center.y).toBe(2);
    expect(b.center.z).toBe(3);
    expect(b.radius).toBe(4);
  });
  test('set', () => {
    const b = new Sphere(new Vec3(1, 2, 3), 4);
    const c = new Sphere();
    c.set(b.center, b.radius);
    expect(c.center.x).toBe(1);
    expect(c.center.y).toBe(2);
    expect(c.center.z).toBe(3);
    expect(c.radius).toBe(4);
  });
  test('copy', () => {
    const b = new Sphere(new Vec3(1, 2, 3), 4);
    const c = new Sphere();
    c.copy(b);
    expect(c.center.x).toBe(1);
    expect(c.center.y).toBe(2);
    expect(c.center.z).toBe(3);
    expect(c.radius).toBe(4);
  });
  test('clone', () => {
    const b = new Sphere(new Vec3(1, 2, 3), 4);
    const c = b.clone();
    expect(c.center.x).toBe(1);
    expect(c.center.y).toBe(2);
    expect(c.center.z).toBe(3);
    expect(c.radius).toBe(4);
  });
});
