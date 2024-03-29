import { Box3 } from './Box3.js';
import { Mat4 } from './Mat4.js';
import { sphereIsEmpty } from './Sphere.Functions.js';
import { Sphere } from './Sphere.js';
import { mat4TransformVec3 } from './Vec3.Functions.js';
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

/**
 * Calculates and returns the center point of the given box.
 */
export function box3Center(box: Box3, result = new Vec3()): Vec3 {
  return result.set(
    (box.min.x + box.max.x) * 0.5,
    (box.min.y + box.max.y) * 0.5,
    (box.min.z + box.max.z) * 0.5
  );
}

/**
 * Creates and returns a new Box3 with an empty state.
 */
export function box3Empty(result = new Box3()): Box3 {
  result.min.x = result.min.y = result.min.z = Number.POSITIVE_INFINITY;
  result.max.x = result.max.y = result.max.z = Number.NEGATIVE_INFINITY;
  return result;
}

/**
 * Checks if the given box is empty.
 */
export function box3IsEmpty(b: Box3): boolean {
  return b.max.x < b.min.x || b.max.y < b.min.y || b.max.z < b.min.z;
}

/**
 * Expands the first box by the second box and returns the result.
 */
export function box3ExpandByBox3(a: Box3, b: Box3, result = new Box3()): Box3 {
  vec3Min(a.min, b.min, result.min);
  vec3Max(a.max, b.max, result.max);
  return result;
}

/**
 * Expands a box by a Vec3 and returns the result.
 */
export function box3ExpandByVec3(b: Box3, v: Vec3, result = new Box3()): Box3 {
  vec3Min(b.min, v, result.min);
  vec3Max(b.max, v, result.max);
  return result;
}

/**
 * Expands a box by a Vec3 and returns the result.
 */
export function box3GrowByVec3(b: Box3, v: Vec3, result = new Box3()): Box3 {
  vec3Subtract(b.min, v, result.min);
  vec3Add(b.max, v, result.max);
  return result;
}

/**
 * Expands a box by a scalar and returns the result.
 */
export function box3GrowByScalar(
  b: Box3,
  s: number,
  result = new Box3()
): Box3 {
  return box3GrowByVec3(b, new Vec3(s, s, s), result);
}

/**
 * Calculates the intersection of two boxes and returns the result.
 */
export function box3IntersectWithBox3(
  a: Box3,
  b: Box3,
  result = new Box3()
): Box3 {
  vec3Max(a.min, b.min, result.min);
  vec3Min(a.max, b.max, result.max);
  return result;
}

/**
 * Translates a box by a Vec3 offset and returns the result.
 */
export function box3Translate(
  b: Box3,
  offset: Vec3,
  result = new Box3()
): Box3 {
  vec3Add(b.min, offset, result.min);
  vec3Add(b.max, offset, result.max);
  return result;
}

/**
 * Checks if two boxes are equal.
 */
export function box3Equals(a: Box3, b: Box3): boolean {
  return vec3Equals(a.min, b.min) && vec3Equals(a.max, b.max);
}

/**
 * Creates a Box3 from an array of Vec3 coordinates and returns the result.
 */
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

/**
 * Creates a Box3 from an array of Vec3 points and returns the result.
 */
export function box3FromVec3s(points: Vec3[], result = new Box3()): Box3 {
  box3Empty(result);
  for (let i = 0, il = points.length; i < il; i++) {
    box3ExpandByVec3(result, points[i], result);
  }
  return result;
}

/**
 * Creates a Box3 from a center point and size vector and returns the result.
 */
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

/**
 * Creates a Box3 from a Sphere and returns the result.
 */
export function box3FromSphere(s: Sphere, result = new Box3()): Box3 {
  if (sphereIsEmpty(s)) {
    return box3Empty(result);
  }

  result.set(s.center, s.center);
  return box3GrowByScalar(result, s.radius, result);
}

/**
 * Checks if a Box3 contains a given Vec3 point.
 */
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

/**
 * Checks if a Box3 contains another Box3.
 */
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

/**
 * Clamps a Vec3 point to the boundaries of a Box3 and returns the result.
 */
export function vec3ClampToBox3(
  point: Vec3,
  box: Box3,
  result: Vec3 = new Vec3()
): Vec3 {
  return vec3Clamp(point, box.min, box.max, result);
}

/**
 * Calculates the distance from a Vec3 point to a Box3 and returns the result.
 */
export function box3DistanceToVec3(box: Box3, point: Vec3): number {
  const clampedPoint = vec3ClampToBox3(point, box);
  return vec3Distance(clampedPoint, point);
}

/**
 * Transforms a Box3 by a Mat4 and returns the result.
 */
// TODO: ensure convention for transform<Primitive>() is consistent across types.
export function mat4TransformBox3(m: Mat4, b: Box3, result = new Box3()): Box3 {
  box3Empty(result);
  if (box3IsEmpty(b)) {
    return result;
  }

  // NOTE: I am using a binary pattern to specify all 2^3 combinations below
  const v = new Vec3();

  box3ExpandByVec3(
    result,
    mat4TransformVec3(m, v.set(b.min.x, b.min.y, b.min.z), v),
    result
  );
  box3ExpandByVec3(
    result,
    mat4TransformVec3(m, v.set(b.min.x, b.min.y, b.max.z), v),
    result
  );
  box3ExpandByVec3(
    result,
    mat4TransformVec3(m, v.set(b.min.x, b.max.y, b.min.z), v),
    result
  );
  box3ExpandByVec3(
    result,
    mat4TransformVec3(m, v.set(b.min.x, b.max.y, b.max.z), v),
    result
  );

  box3ExpandByVec3(
    result,
    mat4TransformVec3(m, v.set(b.max.x, b.min.y, b.min.z), v),
    result
  );
  box3ExpandByVec3(
    result,
    mat4TransformVec3(m, v.set(b.max.x, b.min.y, b.max.z), v),
    result
  );
  box3ExpandByVec3(
    result,
    mat4TransformVec3(m, v.set(b.max.x, b.max.y, b.min.z), v),
    result
  );
  box3ExpandByVec3(
    result,
    mat4TransformVec3(m, v.set(b.max.x, b.max.y, b.max.z), v),
    result
  );

  return result;
}

/**
 * Translates a Box3 by a Vec3 offset and returns the result.
 */
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

/**
 * Checks if two Box3 intersect.
 */
export function box3IntersectsBox3(a: Box3, b: Box3): boolean {
  return (
    a.min.x <= b.max.x &&
    a.max.x >= b.min.x &&
    a.min.y <= b.max.y &&
    a.max.y >= b.min.y &&
    a.min.z <= b.max.z &&
    a.max.z >= b.min.z
  );
}

/**
 * Calculates the dimensional size of a Box3 and returns the result as a Vec3.
 */
export function box3Size(b: Box3): Vec3 {
  return vec3Subtract(b.max, b.min);
}

/**
 * Calculates the maximum size dimension of a Box3 and returns the result.
 */
export function box3MaxSize(b: Box3): number {
  const { max, min } = b;
  return Math.max(max.x - min.x, max.y - min.y, max.z - min.z);
}

/**
 * Scales a Box3 by a Vec3 scale and returns the result.
 */
export function box3Scale(b: Box3, scale: Vec3, result = new Box3()): Box3 {
  result.min.x = b.min.x * scale.x;
  result.min.y = b.min.y * scale.y;
  result.min.z = b.min.z * scale.z;
  result.max.x = b.max.x * scale.x;
  result.max.y = b.max.y * scale.y;
  result.max.z = b.max.z * scale.z;
  return result;
}

/**
 * Expands a Box3 by a Vec3 point and returns the result.
 */
export function box3ExpandByPoint3(
  b: Box3,
  p: Vec3,
  result = new Box3()
): Box3 {
  result.min.x = Math.min(b.min.x, p.x);
  result.min.y = Math.min(b.min.y, p.y);
  result.min.z = Math.min(b.min.z, p.z);
  result.max.x = Math.max(b.max.x, p.x);
  result.max.y = Math.max(b.max.y, p.y);
  result.max.z = Math.max(b.max.z, p.z);
  return result;
}
