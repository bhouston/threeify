import { Attribute } from '../geometry/Attribute.js';
import { makeVec3View } from './arrays/PrimitiveView.js';
import { Box3 } from './Box3.js';
import { Mat4 } from './Mat4.js';
import { sphereIsEmpty } from './Sphere.Functions.js';
import { Sphere } from './Sphere.js';
import { vec3Add } from './Vec3.Functions.js';
import { Vec3 } from './Vec3.js';
import { transformPoint3 } from './Vec3Mat4.Functions.js';

export function makeBox3FromArray(
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

export function makeBox3FromAttribute(
  attribute: Attribute,
  result: Box3
): Box3 {
  let minX = +Number.POSITIVE_INFINITY;
  let minY = +Number.POSITIVE_INFINITY;
  let minZ = +Number.POSITIVE_INFINITY;

  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  let maxZ = Number.NEGATIVE_INFINITY;

  const v = new Vec3();
  const vectorView = makeVec3View(attribute);

  for (let i = 0, l = attribute.count; i < l; i++) {
    vectorView.get(i, v);

    if (v.x < minX) {
      minX = v.x;
    }
    if (v.y < minY) {
      minY = v.y;
    }
    if (v.z < minZ) {
      minZ = v.z;
    }

    if (v.x > maxX) {
      maxX = v.x;
    }
    if (v.y > maxY) {
      maxY = v.y;
    }
    if (v.z > maxZ) {
      maxZ = v.z;
    }
  }

  result.min.set(minX, minY, minZ);
  result.max.set(maxX, maxY, maxZ);

  return result;
}

export function makeBox3FromPoints(points: Vec3[], result = new Box3()): Box3 {
  result.makeEmpty();
  for (let i = 0, il = points.length; i < il; i++) {
    result.expandByPoint(points[i]);
  }
  return result;
}

export function makeBox3FromCenterAndSize(
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

export function makeBox3FromSphereBounds(s: Sphere, result = new Box3()): Box3 {
  if (sphereIsEmpty(s)) {
    return result.makeEmpty();
  }

  result.set(s.center, s.center);
  return result.expandByScalar(s.radius);
}

export function box3ContainsPoint(box: Box3, point: Vec3): boolean {
  return !(
    point.x < box.min.x ||
    point.x > box.max.x ||
    point.y < box.min.y ||
    point.y > box.max.y ||
    point.z < box.min.z ||
    point.z > box.max.z
  );
}

export function box3ContainsBox(box: Box3, queryBox: Box3): boolean {
  return (
    box.min.x <= queryBox.min.x &&
    queryBox.max.x <= box.max.x &&
    box.min.y <= queryBox.min.y &&
    queryBox.max.y <= box.max.y &&
    box.min.z <= queryBox.min.z &&
    queryBox.max.z <= box.max.z
  );
}

export function box3ClampPoint(
  box: Box3,
  point: Vec3,
  result: Vec3 = new Vec3()
): Vec3 {
  return point.clone(result).clamp(box.min, box.max);
}

export function box3DistanceToPoint(box: Box3, point: Vec3): number {
  // TODO: Remove memory allocation
  return point.clone().clamp(box.min, box.max).sub(point).length();
}

export function box3Box3Intersect(a: Box3, b: Box3, result: Box3): boolean {
  result.copy(a);
  result.min.max(b.min);
  result.max.min(b.max);

  // ensure that if there is no overlap, the result is fully empty, not slightly empty
  // with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
  return !result.isEmpty();
}

export function box3Box3Union(a: Box3, b: Box3, result = new Box3()): Box3 {
  result.copy(a);
  result.expandByPoint(b.min);
  result.expandByPoint(b.max);

  return result;
}

// TODO: ensure convention for transform<Primitive>() is consistent across types.
export function transformBox3(b: Box3, m: Mat4, result = new Box3()): Box3 {
  result.makeEmpty();
  if (b.isEmpty()) {
    return result;
  }

  // NOTE: I am using a binary pattern to specify all 2^3 combinations below
  const v = new Vec3();

  result.expandByPoint(transformPoint3(v.set(b.min.x, b.min.y, b.min.z), m, v));
  result.expandByPoint(transformPoint3(v.set(b.min.x, b.min.y, b.max.z), m, v));
  result.expandByPoint(transformPoint3(v.set(b.min.x, b.max.y, b.min.z), m, v));
  result.expandByPoint(transformPoint3(v.set(b.min.x, b.max.y, b.max.z), m, v));

  result.expandByPoint(transformPoint3(v.set(b.max.x, b.min.y, b.min.z), m, v));
  result.expandByPoint(transformPoint3(v.set(b.max.x, b.min.y, b.max.z), m, v));
  result.expandByPoint(transformPoint3(v.set(b.max.x, b.max.y, b.min.z), m, v));
  result.expandByPoint(transformPoint3(v.set(b.max.x, b.max.y, b.max.z), m, v));

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
