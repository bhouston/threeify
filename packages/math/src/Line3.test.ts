import { Line3 } from './Line3.js';
import { Vec3 } from './Vec3.js';

describe('Line3', () => {
  test('constructor defaults', () => {
    const a = new Line3();
    expect(a.start.x).toBe(0);
    expect(a.start.y).toBe(0);
    expect(a.start.z).toBe(0);
    expect(a.end.x).toBe(0);
    expect(a.end.y).toBe(0);
    expect(a.end.z).toBe(0);
  });

  test('constructor values', () => {
    const b = new Line3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    expect(b.start.x).toBe(1);
    expect(b.start.y).toBe(2);
    expect(b.start.z).toBe(3);
    expect(b.end.x).toBe(4);
    expect(b.end.y).toBe(5);
    expect(b.end.z).toBe(6);
  });

  test('clone', () => {
    const b = new Line3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    const c = b.clone();
    expect(c.start.x).toBe(1);
    expect(c.start.y).toBe(2);
    expect(c.start.z).toBe(3);
    expect(c.end.x).toBe(4);
    expect(c.end.y).toBe(5);
    expect(c.end.z).toBe(6);
  });

  test('copy', () => {
    const b = new Line3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    const c = new Line3();
    c.copy(b);
    expect(c.start.x).toBe(1);
    expect(c.start.y).toBe(2);
    expect(c.start.z).toBe(3);
    expect(c.end.x).toBe(4);
    expect(c.end.y).toBe(5);
    expect(c.end.z).toBe(6);
  });
});
