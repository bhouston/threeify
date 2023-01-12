import { Mat4 } from './Mat4';
import { Plane } from './Plane';
import { Ray3 } from './Ray3';
import {
  mat4TransformRay3,
  ray3At,
  ray3DistanceToPlane,
  ray3Equals,
  ray3IntersectPlane,
  ray3LookAt,
  ray3Negate
} from './Ray3.Functions';
import { Vec3 } from './Vec3';
import { vec3Normalize } from './Vec3.Functions';

describe('Ray3 Functions', () => {
  test('ray3Equals', () => {
    const a = new Ray3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    const b = new Ray3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    const c = new Ray3(new Vec3(1, 2, 3), new Vec3(4, 5, 7));
    expect(ray3Equals(a, b)).toBe(true);
    expect(ray3Equals(a, c)).toBe(false);
  });
  test('ray3At', () => {
    const a = new Ray3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    expect(ray3At(a, 0.5)).toEqual(new Vec3(3, 4.5, 6));
  });
  test('ray3LookAt', () => {
    const a = new Ray3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    const b = new Vec3(1, 2, 4);
    expect(ray3LookAt(a, b)).toEqual(
      new Ray3(new Vec3(1, 2, 3), new Vec3(0, 0, 1))
    );
  });
  test('ray3DistanceToPlane', () => {
    const a = new Ray3(new Vec3(1, 2, 3), new Vec3(1, 0, 0));
    const b = new Plane(new Vec3(1, 0, 0), -4);
    expect(ray3DistanceToPlane(a, b)).toEqual(3);
  });
  test('ray3Negate', () => {
    const a = new Ray3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    expect(ray3Negate(a)).toEqual(
      new Ray3(new Vec3(1, 2, 3), new Vec3(-4, -5, -6))
    );
  });

  test('ray3IntersectPlane', () => {
    const a = new Ray3(new Vec3(1, 2, 3), new Vec3(1, 0, 0));
    const b = new Plane(new Vec3(1, 0, 0), -4);
    expect(ray3IntersectPlane(a, b)).toEqual(new Vec3(4, 2, 3));
  });

  test('mat4TransformRay3', () => {
    const a = new Mat4();
    const b = new Ray3(new Vec3(1, 2, 3), vec3Normalize(new Vec3(4, 5, 6)));
    const c = mat4TransformRay3(a, b);
    expect(c.origin.x).toBeCloseTo(b.origin.x);
    expect(c.origin.y).toBeCloseTo(b.origin.y);
    expect(c.origin.z).toBeCloseTo(b.origin.z);
    expect(c.direction.x).toBeCloseTo(b.direction.x);
    expect(c.direction.y).toBeCloseTo(b.direction.y);
    expect(c.direction.z).toBeCloseTo(b.direction.z);
  });
});
