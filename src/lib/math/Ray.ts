//
// based on Quaternion from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat2 } from "../core/hash";
import { ICloneable, IEquatable, IHashable } from "../core/types";
import { Vector3 } from "./Vector3";

export class Ray implements ICloneable<Ray>, IEquatable<Ray>, IHashable {
  constructor(public origin = new Vector3(), public direction = new Vector3(0, 0, -1)) {}

  getHashCode(): number {
    return hashFloat2(this.origin.getHashCode(), this.direction.getHashCode());
  }

  set(origin: Vector3, direction: Vector3): this {
    this.origin.copy(origin);
    this.direction.copy(direction);

    return this;
  }

  clone(): Ray {
    return new Ray().copy(this);
  }

  copy(r: Ray): this {
    this.origin.copy(r.origin);
    this.direction.copy(r.direction);

    return this;
  }

  at(t: number, result: Vector3): Vector3 {
    return result.copy(this.direction).multiplyByScalar(t).add(this.origin);
  }

  lookAt(v: Vector3): this {
    this.direction.copy(v).sub(this.origin).normalize();

    return this;
  }

  equals(r: Ray): boolean {
    return r.origin.equals(this.origin) && r.direction.equals(this.direction);
  }
}
