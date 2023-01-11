import { Box3 } from './Box3.js';
import { mat4TransformPoint3 } from './Mat4.Functions.js';
import { Mat4 } from './Mat4.js';
import { sphereIsEmpty } from './Sphere.Functions.js';
import { Sphere } from './Sphere.js';
import {
  vec3Add,
  vec3Clamp,
  vec3Distance,
  vec3Equals,
  vec3Max,
  vec3Min,
  vec3Subtract
} from './Vec3.Functions.js';
import { Vec3 } from './Vec3.js';

export function box3Center(box: Box3, result = new Vec3()): Vec3 {
  return result.set(
    (box.min.x + box.max.x) * 0.5,
    (box.min.y + box.max.y) * 0.5,
    (box.min.z + box.max.z) * 0.5
  );
}
export function box3Empty(result = new Box3()): Box3 {
  result.min.x = result.min.y = result.min.z = Number.POSITIVE_INFINITY;
  result.max.x = result.max.y = result.max.z = Number.NEGATIVE_INFINITY;
  return result;
}

export function box3IsEmpty(b: Box3): boolean {
  return b.max.x < b.min.x || b.max.y < b.min.y || b.max.z < b.min.z;
}

export function box3UnionWithBox3(a: Box3, b: Box3, result = new Box3()): Box3 {
  vec3Min(a.min, b.min, result.min);
  vec3Max(a.max, b.max, result.max);
  return result;
}

export function box3UnionWithVec3(b: Box3, v: Vec3, result = new Box3()): Box3 {
  vec3Min(b.min, v, result.min);
  vec3Max(b.max, v, result.max);
  return result;
}

export function box3GrowByVec3(b: Box3, v: Vec3, result = new Box3()): Box3 {
  vec3Subtract(b.min, v, result.min);
  vec3Add(b.max, v, result.max);
  return result;
}

export function box3GrowByScalar(
  b: Box3,
  s: number,
  result = new Box3()
): Box3 {
  return box3GrowByVec3(b, new Vec3(s, s, s), result);
}

export function box3IntersectWithBox3(
  a: Box3,
  b: Box3,
  result = new Box3()
): Box3 {
  vec3Max(a.min, b.min, result.min);
  vec3Min(a.max, b.max, result.max);
  return result;
}
export function box3Translate(
  b: Box3,
  offset: Vec3,
  result = new Box3()
): Box3 {
  vec3Add(b.min, offset, result.min);
  vec3Add(b.max, offset, result.max);
  return result;
}

export function box3Equals(a: Box3, b: Box3): boolean {
  return vec3Equals(a.min, b.min) && vec3Equals(a.max, b.max);
}

export function box3FromVec3Array(
  array: Float32Array,
  result = new Box3()
): Box3 {
  let minX = +Number.POSITIVE_INFINITY;
  let minY = +Number.POSITIVE_INFINITY;
  let minZ = +Number.POSITIVE_INFINITY;

  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  let maxZ = Number.NEGATIVE_INFINITY;

  for (let i = 0, l = array.length; i < l; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    if (x < minX) {
      minX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (z < minZ) {
      minZ = z;
    }

    if (x > maxX) {
      maxX = x;
    }
    if (y > maxY) {
      maxY = y;
    }
    if (z > maxZ) {
      maxZ = z;
    }
  }

  result.min.set(minX, minY, minZ);
  result.max.set(maxX, maxY, maxZ);

  return result;
}

export function box3FromVec3s(points: Vec3[], result = new Box3()): Box3 {
  box3Empty(result);
  for (let i = 0, il = points.length; i < il; i++) {
    box3UnionWithVec3(result, points[i], result);
  }
  return result;
}

export function box3FromCenterAndSize(
  center: Vec3,
  size: Vec3,
  result = new Box3()
): Box3 {
  result.min.set(
    center.x - size.x * 0.5,
    center.y - size.y * 0.5,
    center.z - size.z * 0.5
  );
  result.max.set(
    center.x + size.x * 0.5,
    center.y + size.y * 0.5,
    center.z + size.z * 0.5
  );
  return result;
}

export function box3FromSphere(s: Sphere, result = new Box3()): Box3 {
  if (sphereIsEmpty(s)) {
    return box3Empty(result);
  }

  result.set(s.center, s.center);
  return box3GrowByScalar(result, s.radius, result);
}

export function box3ContainsVec3(box: Box3, point: Vec3): boolean {
  return !(
    point.x < box.min.x ||
    point.x > box.max.x ||
    point.y < box.min.y ||
    point.y > box.max.y ||
    point.z < box.min.z ||
    point.z > box.max.z
  );
}

export function box3ContainsBox3(box: Box3, queryBox: Box3): boolean {
  return (
    box.min.x <= queryBox.min.x &&
    queryBox.max.x <= box.max.x &&
    box.min.y <= queryBox.min.y &&
    queryBox.max.y <= box.max.y &&
    box.min.z <= queryBox.min.z &&
    queryBox.max.z <= box.max.z
  );
}

export function vec3ClampToBox3(
  point: Vec3,
  box: Box3,
  result: Vec3 = new Vec3()
): Vec3 {
  return vec3Clamp(point, box.min, box.max, result);
}

export function box3DistanceToVec3(box: Box3, point: Vec3): number {
  const clampedPoint = vec3ClampToBox3(point, box);
  return vec3Distance(clampedPoint, point);
}

// TODO: ensure convention for transform<Primitive>() is consistent across types.
export function mat4TransformBox3(m: Mat4, b: Box3, result = new Box3()): Box3 {
  box3Empty(result);
  if (box3IsEmpty(b)) {
    return result;
  }

  // NOTE: I am using a binary pattern to specify all 2^3 combinations below
  const v = new Vec3();

  box3UnionWithVec3(
    result,
    mat4TransformPoint3(m, v.set(b.min.x, b.min.y, b.min.z), v),
    result
  );
  box3UnionWithVec3(
    result,
    mat4TransformPoint3(m, v.set(b.min.x, b.min.y, b.max.z), v),
    result
  );
  box3UnionWithVec3(
    result,
    mat4TransformPoint3(m, v.set(b.min.x, b.max.y, b.min.z), v),
    result
  );
  box3UnionWithVec3(
    result,
    mat4TransformPoint3(m, v.set(b.min.x, b.max.y, b.max.z), v),
    result
  );

  box3UnionWithVec3(
    result,
    mat4TransformPoint3(m, v.set(b.max.x, b.min.y, b.min.z), v),
    result
  );
  box3UnionWithVec3(
    result,
    mat4TransformPoint3(m, v.set(b.max.x, b.min.y, b.max.z), v),
    result
  );
  box3UnionWithVec3(
    result,
    mat4TransformPoint3(m, v.set(b.max.x, b.max.y, b.min.z), v),
    result
  );
  box3UnionWithVec3(
    result,
    mat4TransformPoint3(m, v.set(b.max.x, b.max.y, b.max.z), v),
    result
  );

  return result;
}

export function translateBox3(
  b: Box3,
  offset: Vec3,
  result = new Box3()
): Box3 {
  b.clone(result);
  vec3Add(result.min, offset, result.min);
  vec3Add(result.max, offset, result.max);

  return result;
}
