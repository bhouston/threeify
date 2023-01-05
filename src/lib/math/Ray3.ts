//
// based on Quaternion from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat2 } from '../core/hash.js';
import { ICloneable, IEquatable, IHashable } from '../core/types.js';
import { Vector3 } from './Vector3.js';

export class Ray3 implements ICloneable<Ray3>, IEquatable<Ray3>, IHashable {
  constructor(
    public origin = new Vector3(),
    public direction = new Vector3(0, 0, -1)
  ) {}

  getHashCode(): number {
    return hashFloat2(this.origin.getHashCode(), this.direction.getHashCode());
  }

  set(origin: Vector3, direction: Vector3): this {
    this.origin.copy(origin);
    this.direction.copy(direction);

    return this;
  }

  clone(): Ray3 {
    return new Ray3().copy(this);
  }

  copy(r: Ray3): this {
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

  equals(r: Ray3): boolean {
    return r.origin.equals(this.origin) && r.direction.equals(this.direction);
  }
}
