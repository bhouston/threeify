//
// based on Line3 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat2 } from '../core/hash';
import { ICloneable, IEquatable, IHashable } from '../core/types';
import { Vector3 } from './Vector3';

export class Line3 implements ICloneable<Line3>, IEquatable<Line3>, IHashable {
  constructor(public start = new Vector3(), public end = new Vector3()) {}

  getHashCode(): number {
    return hashFloat2(this.start.getHashCode(), this.end.getHashCode());
  }

  set(start: Vector3, end: Vector3): this {
    this.start.copy(start);
    this.end.copy(end);

    return this;
  }

  clone(): Line3 {
    return new Line3().copy(this);
  }

  copy(l: Line3): this {
    this.start.copy(l.start);
    this.end.copy(l.end);

    return this;
  }

  equals(l: Line3): boolean {
    return l.start.equals(this.start) && l.end.equals(this.end);
  }
}
