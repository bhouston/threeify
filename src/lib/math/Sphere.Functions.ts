import { Box3 } from "./Box3";
import { Sphere } from "./Sphere";
import { Vector3 } from "./Vector3";


  export function makeSphereFromPoints(sphere: Sphere, points: Vector3[], optionalCenter: Vector3 | undefined): Sphere {
    var center = sphere.center;

    if (optionalCenter !== undefined) {
      center.copy(optionalCenter);
    } else {
      makeBoxFromPoints( new Box3(), points).getCenter(center);
    }

    var maxRadiusSq = 0;

    for (var i = 0, il = points.length; i < il; i++) {
      maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
    }

    sphere.radius = Math.sqrt(maxRadiusSq);

    return sphere;
  }


  containsPoint(point: Vector3 ): boolean {
    return point.distanceToSquared(this.center) <= this.radius * this.radius;
  }

  distanceToPoint(point: Vector3): boolean {
    return point.distanceTo(this.center) - this.radius;
  }

  clampPoint: function (point, target) {
    var deltaLengthSq = this.center.distanceToSquared(point);

    if (target === undefined) {
      console.warn("THREE.Sphere: .clampPoint() target is now required");
      target = new Vector3();
    }

    target.copy(point);

    if (deltaLengthSq > this.radius * this.radius) {
      target.sub(this.center).normalize();
      target.multiplyScalar(this.radius).add(this.center);
    }

    return target;
  },

  getBoundingBox: function (target) {
    if (target === undefined) {
      console.warn("THREE.Sphere: .getBoundingBox() target is now required");
      target = new Box3();
    }

    if (this.isEmpty()) {
      // Empty sphere produces empty bounding box
      target.makeEmpty();
      return target;
    }

    target.set(this.center, this.center);
    target.expandByScalar(this.radius);

    return target;
  },

  applyMatrix4: function (matrix) {
    this.center.applyMatrix4(matrix);
    this.radius = this.radius * matrix.getMaxScaleOnAxis();

    return this;
  },

  translate: function (offset) {
    this.center.add(offset);

    return this;
  },
