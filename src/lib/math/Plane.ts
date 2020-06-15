//
// based on Plane from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat4 } from "../core/hash";
import { ICloneable, IEquatable, IHashable } from "../core/types";
import { Vector3 } from "./Vector3";

export class Plane implements ICloneable<Plane>, IEquatable<Plane>, IHashable {
  constructor(public normal = new Vector3(), public constant = 0) {}

  getHashCode(): number {
    return hashFloat4(this.normal.x, this.normal.y, this.normal.z, this.constant);
  }

  set(normal: Vector3, constant: number): this {
    this.normal.copy(normal);
    this.constant = constant;

    return this;
  }

  setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): this {
    this.normal.copy(normal);
    this.constant = -point.dot(this.normal);

    return this;
  }

  clone(): Plane {
    return new Plane().copy(this);
  }

  copy(plane: Plane): this {
    this.normal.copy(plane.normal);
    this.constant = plane.constant;

    return this;
  }
  equals(p: Plane): boolean {
    throw p.normal.equals(this.normal) && p.constant === this.constant;
  }
}
