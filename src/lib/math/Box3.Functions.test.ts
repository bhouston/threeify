import { Box3 } from './Box3';
import {
  box3Center,
  box3ContainsBox3,
  box3ContainsVec3,
  box3DistanceToVec3,
  box3Empty,
  box3Equals,
  box3ExpandByBox3,
  box3ExpandByPoint3,
  box3IntersectsBox3,
  box3IsEmpty,
  box3Scale,
  box3Size,
  box3Translate,
  vec3ClampToBox3
} from './Box3.Functions';
import { Vec3 } from './Vec3';
import { vec3Equals } from './Vec3.Functions';

const unit = new Box3(new Vec3(0, 0), new Vec3(1, 1, 1));
const empty = new Box3();

describe('Box3 Functions', () => {
  test('box3Equals', () => {
    expect(box3Equals(unit, unit)).toBe(true);
    expect(box3Equals(unit, empty)).toBe(false);
  });

  test('box3Empty', () => {
    expect(box3Equals(box3Empty(), empty)).toBe(false);
  });

  test('box3IsEmpty', () => {
    expect(box3IsEmpty(unit)).toBe(false);
    expect(box3IsEmpty(empty)).toBe(true);
  });

  test('box3Translate', () => {
    expect(
      box3Equals(
        box3Translate(unit, new Vec3(1, 1, 1)),
        new Box3(new Vec3(1, 1, 1), new Vec3(2, 2, 2))
      )
    ).toBe(true);
  });

  test('box3Scale', () => {
    expect(
      box3Equals(
        box3Scale(unit, new Vec3(2, 2, 2)),
        new Box3(new Vec3(0, 0, 0), new Vec3(2, 2, 2))
      )
    ).toBe(true);
  });

  test('box3Center', () => {
    expect(vec3Equals(box3Center(unit), new Vec3(0.5, 0.5, 0.5))).toBe(true);
  });

  test('box3Size', () => {
    expect(vec3Equals(box3Size(unit), new Vec3(1, 1, 1))).toBe(true);
  });

  test('box3ExpandByPoint3', () => {
    expect(
      box3Equals(
        box3ExpandByPoint3(unit, new Vec3(2, 2, 2)),
        new Box3(new Vec3(0, 0, 0), new Vec3(2, 2, 2))
      )
    ).toBe(true);
  });

  test('box3ExpandByBox3', () => {
    expect(
      box3Equals(
        box3ExpandByBox3(unit, new Box3(new Vec3(2, 2, 2), new Vec3(3, 3, 3))),
        new Box3(new Vec3(0, 0), new Vec3(3, 3, 3))
      )
    ).toBe(true);
    expect(box3Equals(box3ExpandByBox3(unit, empty), unit)).toBe(true);
    expect(box3Equals(box3ExpandByBox3(empty, unit), unit)).toBe(true);
  });

  test('box3ContainsVec3', () => {
    expect(box3ContainsVec3(unit, new Vec3(0.5, 0.5, 0.5))).toBe(true);
    expect(box3ContainsVec3(unit, new Vec3(1.5, 0.5, 0.5))).toBe(false);
  });

  test('box3ContainsBox3', () => {
    expect(
      box3ContainsBox3(
        unit,
        new Box3(new Vec3(0.5, 0.5, 0.5), new Vec3(0.6, 0.6, 0.6))
      )
    ).toBe(true);
    expect(
      box3ContainsBox3(
        unit,
        new Box3(new Vec3(0.5, 0.5, 0.5), new Vec3(1.6, 0.6, 0.6))
      )
    ).toBe(false);
  });

  test('vec3ClampToBox3', () => {
    expect(
      vec3Equals(
        vec3ClampToBox3(new Vec3(0.5, 0.5, 0.5), unit),
        new Vec3(0.5, 0.5, 0.5)
      )
    ).toBe(true);
  });

  test('box3DistanceToVec3', () => {
    expect(box3DistanceToVec3(unit, new Vec3(0.5, 0.5, 0.5))).toBe(0);
    expect(box3DistanceToVec3(unit, new Vec3(1.5, 0.5, 0.5))).toBe(0.5);
  });

  test('box3IntersectionBox3', () => {
    expect(
      box3IntersectsBox3(
        unit,
        new Box3(new Vec3(0.5, 0.5, 0.5), new Vec3(1.5, 1.5, 1.5))
      )
    ).toBe(true);
  });

  test('box3ExpandByPoint3', () => {
    expect(
      box3Equals(
        box3ExpandByPoint3(unit, new Vec3(2, 2, 2)),
        new Box3(new Vec3(0, 0, 0), new Vec3(2, 2, 2))
      )
    ).toBe(true);
  });
});
