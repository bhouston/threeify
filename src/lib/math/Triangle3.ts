import { hashFloat3 } from '../core/hash.js';
import { ICloneable, IEquatable, IHashable } from '../core/types.js';
import { Vec3 } from './Vec3.js';

export class Triangle3
  implements ICloneable<Triangle3>, IEquatable<Triangle3>, IHashable
{
  constructor(
    public a = new Vec3(),
    public b = new Vec3(),
    public c = new Vec3()
  ) {}

  getHashCode(): number {
    return hashFloat3(
      this.a.getHashCode(),
      this.b.getHashCode(),
      this.c.getHashCode()
    );
  }

  set(a: Vec3, b: Vec3, c: Vec3): this {
    this.a.copy(a);
    this.b.copy(b);
    this.c.copy(c);

    return this;
  }

  clone(): Triangle3 {
    return new Triangle3().copy(this);
  }

  copy(t: Triangle3): this {
    return this.set(t.a, t.b, t.c);
  }

  equals(t: Triangle3): boolean {
    return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
  }
}
