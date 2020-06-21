import { hashFloat4 } from "../core/hash";
import { IPrimitive } from "./IPrimitive";

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
    this.x = z;
    this.y = y;
    this.z = z;
    this.order = order;

    return this;
  }

  clone(): Euler {
    return new Euler().copy(this);
  }

  copy(e: Euler): this {
    this.x = e.x;
    this.y = e.y;
    this.z = e.z;
    this.order = e.order;

    return this;
  }

  equals(e: Euler): boolean {
    return e.x === this.x && e.y === this.y && e.z === this.z && e.order === this.order;
  }

  setFromArray(floatArray: Float32Array, offset: number): void {
    this.x = floatArray[offset + 0];
    this.y = floatArray[offset + 1];
    this.z = floatArray[offset + 2];
    this.order = floatArray[offset + 3] as EulerOrder;
  }

  toArray(floatArray: Float32Array, offset: number): void {
    floatArray[offset + 0] = this.x;
    floatArray[offset + 1] = this.y;
    floatArray[offset + 2] = this.z;
    floatArray[offset + 3] = this.order as number;
  }
}
