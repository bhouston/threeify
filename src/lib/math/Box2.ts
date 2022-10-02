//
// based on Box2 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat2 } from '../core/hash';
import { ICloneable, IEquatable, IHashable } from '../core/types';
import { Vector2 } from './Vector2';

export class Box2 implements ICloneable<Box2>, IEquatable<Box2>, IHashable {
  constructor(
    public min = new Vector2(+Infinity, +Infinity),
    public max = new Vector2(+Infinity, +Infinity)
  ) {}

  get x(): number {
    return this.min.x;
  }

  get y(): number {
    return this.min.y;
  }

  get left(): number {
    return this.min.x;
  }

  get top(): number {
    return this.min.y;
  }

  get width(): number {
    return this.max.x - this.min.x;
  }

  get height(): number {
    return this.max.y - this.min.y;
  }

  get bottom(): number {
    return this.max.y;
  }

  get right(): number {
    return this.max.x;
  }

  getHashCode(): number {
    return hashFloat2(this.min.getHashCode(), this.max.getHashCode());
  }

  set(min: Vector2, max: Vector2): this {
    this.min.copy(min);
    this.max.copy(max);

    return this;
  }

  clone(): Box2 {
    return new Box2().copy(this);
  }

  copy(box: Box2): this {
    this.min.copy(box.min);
    this.max.copy(box.max);

    return this;
  }

  getCenter(v: Vector2): Vector2 {
    return v.set(
      (this.min.x + this.max.x) * 0.5,
      (this.min.y + this.max.y) * 0.5
    );
  }

  makeEmpty(): this {
    this.min.x = this.min.y = +Infinity;
    this.max.x = this.max.y = -Infinity;

    return this;
  }

  isEmpty(): boolean {
    // this is a more robust check for empty than ( volume <= 0 ) because
    // volume can get positive with two negative axes

    return this.max.x < this.min.x || this.max.y < this.min.y;
  }

  union(box: Box2): this {
    this.min.min(box.min);
    this.max.max(box.max);

    return this;
  }

  translate(offset: Vector2): this {
    this.min.add(offset);
    this.max.add(offset);

    return this;
  }

  equals(box: Box2): boolean {
    return box.min.equals(this.min) && box.max.equals(this.max);
  }
}
