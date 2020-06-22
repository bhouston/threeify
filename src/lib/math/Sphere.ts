import { Vector3 } from "./Vector3.js";

export class Sphere {
  constructor(public center = new Vector3(), public radius = -1) {}

  set(center: Vector3, radius: number): this {
    this.center.copy(center);
    this.radius = radius;

    return this;
  }

  clone(): Sphere {
    return new Sphere().copy(this);
  }

  copy(sphere: Sphere): this {
    this.center.copy(sphere.center);
    this.radius = sphere.radius;

    return this;
  }

  isEmpty(): boolean {
    return this.radius < 0;
  }

  makeEmpty(): this {
    this.center.set(0, 0, 0);
    this.radius = -1;

    return this;
  }

  equals(s: Sphere): boolean {
    return s.center.equals(this.center) && s.radius === this.radius;
  }
}
