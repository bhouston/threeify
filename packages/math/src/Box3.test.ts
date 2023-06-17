// a set of ts-jest unit tests that ensure the correct functionality of the class Box3

import { Box3 } from './Box3';
import { Vec3 } from './Vec3';

describe('Box3', () => {
  test('constructor', () => {
    const box = new Box3();
    expect(box.min.x).toBe(Number.POSITIVE_INFINITY);
    expect(box.min.y).toBe(Number.POSITIVE_INFINITY);
    expect(box.min.z).toBe(Number.POSITIVE_INFINITY);
    expect(box.max.x).toBe(Number.NEGATIVE_INFINITY);
    expect(box.max.y).toBe(Number.NEGATIVE_INFINITY);
    expect(box.max.z).toBe(Number.NEGATIVE_INFINITY);
  });
  test('constructor with values', () => {
    const box = new Box3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    expect(box.min.x).toBe(1);
    expect(box.min.y).toBe(2);
    expect(box.min.z).toBe(3);
    expect(box.max.x).toBe(4);
    expect(box.max.y).toBe(5);
    expect(box.max.z).toBe(6);
  });
  test('clone', () => {
    const box = new Box3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    const box2 = box.clone();
    expect(box2.min.x).toBe(1);
    expect(box2.min.y).toBe(2);
    expect(box2.min.z).toBe(3);
    expect(box2.max.x).toBe(4);
    expect(box2.max.y).toBe(5);
    expect(box2.max.z).toBe(6);
  });
  test('copy', () => {
    const box = new Box3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    const box2 = new Box3();
    box2.copy(box);
    expect(box2.min.x).toBe(1);
    expect(box2.min.y).toBe(2);
    expect(box2.min.z).toBe(3);
    expect(box2.max.x).toBe(4);
    expect(box2.max.y).toBe(5);
    expect(box2.max.z).toBe(6);
  });
  test('x,y,z,width,height,depth', () => {
    const box = new Box3(new Vec3(1, 2, 3), new Vec3(5, 8, 11));
    expect(box.x).toBe(1);
    expect(box.y).toBe(2);
    expect(box.z).toBe(3);
    expect(box.width).toBe(4);
    expect(box.height).toBe(6);
    expect(box.depth).toBe(8);
  });
});
