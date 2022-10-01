import { hashFloat4 } from '../core/hash';
import { IPrimitive } from './IPrimitive';

export enum EulerOrder {
  XYZ,
  YXZ,
  ZXY,
  ZYX,
  YZX,
  XZY,
  Default = EulerOrder.XYZ,
}

export class Euler implements IPrimitive<Euler> {
  constructor(public x = 0, public y = 0, public z = 0, public order: EulerOrder = EulerOrder.Default) {}

  getHashCode(): number {
    return hashFloat4(this.x, this.y, this.z, this.order as number);
  }

  set(x: number, y: number, z: number, order: EulerOrder = EulerOrder.Default): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;

    return this;
  }

  clone(): Euler {
    return new Euler().copy(this);
  }

  copy(e: Euler): this {
    return this.set(e.x, e.y, e.z, e.order);
  }

  equals(e: Euler): boolean {
    return e.x === this.x && e.y === this.y && e.z === this.z && e.order === this.order;
  }

  setFromArray(array: Float32Array, offset: number): void {
    this.x = array[offset + 0];
    this.y = array[offset + 1];
    this.z = array[offset + 2];
    this.order = array[offset + 3] as EulerOrder;
  }

  toArray(array: Float32Array, offset: number): void {
    array[offset + 0] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    array[offset + 3] = this.order as number;
  }
}
