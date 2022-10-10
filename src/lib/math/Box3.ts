//
// based on Box3 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat2 } from '../core/hash.js';
import { ICloneable, IEquatable, IHashable } from '../core/types.js';
import { Vector3 } from './Vector3.js';

export class Box3 implements ICloneable<Box3>, IEquatable<Box3>, IHashable {
  constructor(
    public min = new Vector3(
      +Number.POSITIVE_INFINITY,
      +Number.POSITIVE_INFINITY,
      +Number.POSITIVE_INFINITY
    ),
    public max = new Vector3(
      +Number.POSITIVE_INFINITY,
      +Number.POSITIVE_INFINITY,
      +Number.POSITIVE_INFINITY
    )
  ) {}

  getHashCode(): number {
    return hashFloat2(this.min.getHashCode(), this.max.getHashCode());
  }

  set(min: Vector3, max: Vector3): this {
    this.min.copy(min);
    this.max.copy(max);

    return this;
  }

  clone(): Box3 {
    return new Box3().copy(this);
  }

  copy(box: Box3): this {
    this.min.copy(box.min);
    this.max.copy(box.max);

    return this;
  }

  getCenter(result = new Vector3()): Vector3 {
    return result.set(
      (this.min.x + this.max.x) * 0.5,
      (this.min.y + this.max.y) * 0.5,
      (this.min.z + this.max.z) * 0.5
    );
  }

  makeEmpty(): this {
    this.min.x = this.min.y = this.min.z = +Number.POSITIVE_INFINITY;
    this.max.x = this.max.y = this.max.z = Number.NEGATIVE_INFINITY;

    return this;
  }

  isEmpty(): boolean {
    // this is a more robust check for empty than ( volume <= 0 ) because
    // volume can get positive with two negative axes

    return (
      this.max.x < this.min.x ||
      this.max.y < this.min.y ||
      this.max.z < this.min.z
    );
  }

  expandByPoint(point: Vector3): this {
    this.min.min(point);
    this.max.max(point);

    return this;
  }

  expandByVector(vector: Vector3): this {
    this.min.sub(vector);
    this.max.add(vector);

    return this;
  }

  expandByScalar(scalar: number): this {
    this.min.addScalar(-scalar);
    this.max.addScalar(scalar);

    return this;
  }

  intersect(box: Box3): this {
    this.min.max(box.min);
    this.max.min(box.max);

    return this;
  }

  union(box: Box3): this {
    this.min.min(box.min);
    this.max.max(box.max);

    return this;
  }

  translate(offset: Vector3): this {
    this.min.add(offset);
    this.max.add(offset);

    return this;
  }

  equals(box: Box3): boolean {
    return box.min.equals(this.min) && box.max.equals(this.max);
  }
}
