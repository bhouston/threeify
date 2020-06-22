import { Attribute } from "../geometry/Attribute";
import { Vector3View } from "./arrays/PrimitiveView";
import { Box3 } from "./Box3";
import { Vector3 } from "./Vector3";

export function makeBox3FromArray(box: Box3, array:Float32Array): Box3 {
    var minX = +Infinity;
    var minY = +Infinity;
    var minZ = +Infinity;

    var maxX = -Infinity;
    var maxY = -Infinity;
    var maxZ = -Infinity;

    for (var i = 0, l = array.length; i < l; i += 3) {
      var x = array[i];
      var y = array[i + 1];
      var z = array[i + 2];

      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (z < minZ) minZ = z;

      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      if (z > maxZ) maxZ = z;
    }

    box.min.set(minX, minY, minZ);
    box.max.set(maxX, maxY, maxZ);

    return box;
  }

  export function makeBox3FromAttribute(box: Box3, attribute: Attribute): Box3 {
    var minX = +Infinity;
    var minY = +Infinity;
    var minZ = +Infinity;

    var maxX = -Infinity;
    var maxY = -Infinity;
    var maxZ = -Infinity;

    const v = new Vector3();
    const vectorView = new Vector3View( attribute );

    for (var i = 0, l = attribute.count; i < l; i++) {
      vectorView.get( i, v );

      if (v.x < minX) minX = v.x;
      if (v.y < minY) minY = v.y;
      if (v.z < minZ) minZ = v.z;

      if (v.x > maxX) maxX = v.x;
      if (v.y > maxY) maxY = v.y;
      if (v.z > maxZ) maxZ = v.z;
    }

    box.min.set(minX, minY, minZ);
    box.max.set(maxX, maxY, maxZ);

    return box;
  }

  export function makeBox3FromPoints(box: Box3, points: Vector3[] ): Box3 {
    box.makeEmpty();

    for (var i = 0, il = points.length; i < il; i++) {
      box.expandByPoint(points[i]);
    }

    return box;
  }

export function makeBox3FromCenterAndSize(box: Box3, center: Vector3, size: Vector3): Box3 {

    box.min.set( center.x - size.x * 0.5, center.y - size.y * 0.5, center.z - size.z * 0.5, );
    box.max.set( center.x + size.x * 0.5, center.y + size.y * 0.5, center.z + size.z * 0.5, );

    return box;
  }

export function box3ContainsPoint(box:Box3, point: Vector3): boolean {
    return point.x < box.min.x ||
      point.x > box.max.x ||
      point.y < box.min.y ||
      point.y > box.max.y ||
      point.z < box.min.z ||
      point.z > box.max.z
      ? false
      : true;
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


  clampPoint: function (point, target) {
    if (target === undefined) {
      console.warn("THREE.Box3: .clampPoint() target is now required");
      target = new Vector3();
    }

    return target.copy(point).clamp(this.min, this.max);
  },

  distanceToPoint: function (point) {
    var clampedPoint = _vector.copy(point).clamp(this.min, this.max);

    return clampedPoint.sub(point).length();
  },

  getBoundingSphere: function (target) {
    if (target === undefined) {
      console.error("THREE.Box3: .getBoundingSphere() target is now required");
      //target = new Sphere(); // removed to avoid cyclic dependency
    }

    this.getCenter(target.center);

    target.radius = this.getSize(_vector).length() * 0.5;

    return target;
  },

  intersect: function (box) {
    this.min.max(box.min);
    this.max.min(box.max);

    // ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
    if (this.isEmpty()) this.makeEmpty();

    return this;
  },

  union: function (box) {
    this.min.min(box.min);
    this.max.max(box.max);

    return this;
  },

  applyMatrix4: function (matrix) {
    // transform of empty box is an empty box.
    if (this.isEmpty()) return this;

    // NOTE: I am using a binary pattern to specify all 2^3 combinations below
    _points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix); // 000
    _points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix); // 001
    _points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix); // 010
    _points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix); // 011
    _points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix); // 100
    _points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix); // 101
    _points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix); // 110
    _points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix); // 111

    this.setFromPoints(_points);

    return this;
  },

  translate: function (offset) {
    this.min.add(offset);
    this.max.add(offset);

    return this;
  },
