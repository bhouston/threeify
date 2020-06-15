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

  constructor(min: Vector2 | null = null, max: Vector2 | null = null) {
    if (min !== null) {
      this.min.copy(min);
    }
    if (max !== null) {
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

  setFromPoints(points: Vector2[]): this {
    this.makeEmpty();

    points.forEach((point) => {
      this.expandByPoint(point);
    });

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

  expandByPoint(point: Vector2): this {
    this.min.min(point);
    this.max.max(point);

    return this;
  }

  containsPoint(point: Vector2): boolean {
    return point.x < this.min.x || point.x > this.max.x || point.y < this.min.y || point.y > this.max.y ? false : true;
  }

  containsBox(box: Box2): boolean {
    return this.min.x <= box.min.x && box.max.x <= this.max.x && this.min.y <= box.min.y && box.max.y <= this.max.y;
  }

  clampPoint(point: Vector2): Vector2 {
    return new Vector2().copy(point).clamp(this.min, this.max);
  }

  distanceToPoint(point: Vector2): number {
    const clampedPoint = new Vector2().copy(point).clamp(this.min, this.max);
    return clampedPoint.sub(point).length();
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
