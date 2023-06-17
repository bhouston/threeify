import { hashFloat3 } from './utils/hash';
import { Vec3 } from './Vec3';

export class Triangle3 {
  constructor(
    public readonly a = new Vec3(),
    public readonly b = new Vec3(),
    public readonly c = new Vec3()
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

  getComponent(index: number): Vec3 {
    switch (index) {
      case 0:
        return this.a;
      case 1:
        return this.b;
      case 2:
        return this.c;
      default:
        throw new Error(`index is out of range: ${index}`);
    }
  }

  setComponent(index: number, v: Vec3): this {
    switch (index) {
      case 0:
        this.a.copy(v);
        break;
      case 1:
        this.b.copy(v);
        break;
      case 2:
        this.c.copy(v);
        break;
      default:
        throw new Error(`index is out of range: ${index}`);
    }
    return this;
  }
}
