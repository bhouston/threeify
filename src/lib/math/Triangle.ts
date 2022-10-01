import { hashFloat3 } from '../core/hash';
import { ICloneable, IEquatable, IHashable } from '../core/types';
import { Vector3 } from './Vector3';

export class Triangle implements ICloneable<Triangle>, IEquatable<Triangle>, IHashable {
  constructor(public a = new Vector3(), public b = new Vector3(), public c = new Vector3()) {}

  getHashCode(): number {
    return hashFloat3(this.a.getHashCode(), this.b.getHashCode(), this.c.getHashCode());
  }

  set(a: Vector3, b: Vector3, c: Vector3): this {
    this.a.copy(a);
    this.b.copy(b);
    this.c.copy(c);

    return this;
  }

  clone(): Triangle {
    return new Triangle().copy(this);
  }

  copy(t: Triangle): this {
    return this.set(t.a, t.b, t.c);
  }

  equals(t: Triangle): boolean {
    return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
  }
}
