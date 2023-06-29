import { Box3 } from './Box3.js';
import {
  box3ToSphere,
  sphereEmpty,
  sphereIsEmpty,
  sphereScale,
  sphereTranslate,
  vec3ArrayToSphere
} from './Sphere.Functions.js';
import { Sphere } from './Sphere.js';
import { Vec3 } from './Vec3.js';

describe('Sphere Functions', () => {
  test('vec3ArrayToSphere', () => {
    const points = [
      new Vec3(1, 0, 0),
      new Vec3(0, 1, 0),
      new Vec3(0, 0, 1),
      new Vec3(0, 0, -1),
      new Vec3(0, -1, 0),
      new Vec3(-1, 0, 0)
    ];

    const sphere = vec3ArrayToSphere(points);

    expect(sphere.center.x).toBeCloseTo(0);
    expect(sphere.center.y).toBeCloseTo(0);
    expect(sphere.center.z).toBeCloseTo(0);
    expect(sphere.radius).toBeCloseTo(1);
  });

  test('sphereIsEmpty', () => {
    const sphere = new Sphere();
    expect(sphereIsEmpty(sphere)).toBe(true);
  });

  test('sphereEmpty', () => {
    const sphere = sphereEmpty();
    expect(sphereIsEmpty(sphere)).toBe(true);
  });

  test('box3ToSphere', () => {
    const box = new Box3(new Vec3(1, 1, 1), new Vec3(2, 2, 2));
    const sphere = box3ToSphere(box);
    expect(sphere.center.x).toBeCloseTo(1.5);
    expect(sphere.center.y).toBeCloseTo(1.5);
    expect(sphere.center.z).toBeCloseTo(1.5);
    expect(sphere.radius).toBeCloseTo(Math.sqrt(3 * Math.pow(0.5, 2)));
  });

  test('sphereTranslate', () => {
    const sphere = new Sphere(new Vec3(1, 1, 1), 1);
    sphereTranslate(sphere, new Vec3(1, 1, 1), sphere);
    expect(sphere.center.x).toBeCloseTo(2);
    expect(sphere.center.y).toBeCloseTo(2);
    expect(sphere.center.z).toBeCloseTo(2);
    expect(sphere.radius).toBeCloseTo(1);
  });

  test('sphereScale', () => {
    const sphere = new Sphere(new Vec3(1, 1, 1), 1);
    sphereScale(sphere, 2, sphere);
    expect(sphere.center.x).toBeCloseTo(1);
    expect(sphere.center.y).toBeCloseTo(1);
    expect(sphere.center.z).toBeCloseTo(1);
    expect(sphere.radius).toBeCloseTo(2);
  });
});
