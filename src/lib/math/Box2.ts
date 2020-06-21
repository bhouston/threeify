//
// based on Color from Three.js
//
// Authors:
// * @bhouston
//

import { ICloneable, IEquatable, IHashable } from "../core/types";
import { Vector2 } from "./Vector2";

export class Box2 implements ICloneable<Box2>, IEquatable<Box2>, IHashable {
  min: Vector2 = new Vector2(+Infinity, +Infinity);
  max: Vector2 = new Vector2(-Infinity, -Infinity);

  constructor(min: Vector2 | undefined = undefined, max: Vector2 | undefined = undefined) {
    if (min !== undefined) {
      this.min.copy(min);
    }
    if (max !== undefined) {
      this.max.copy(max);
    }
  }

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
    return (this.min.getHashCode() * 397) ^ (this.max.getHashCode() | 0);
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

  intersect(box: Box2): this {
    this.min.max(box.min);
    this.max.min(box.max);

    return this;
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
