import { IPrimitive } from "./IPrimitive";
import { Matrix4 } from "./Matrix4";
import { Quaternion } from "./Quaternion";
import { hashFloat4 } from "../hash";

export enum EulerOrder {
  XYZ,
  YXZ,
  ZXY,
  ZYX,
  YZX,
  XZY,
  Default = EulerOrder.XYZ,
}

export class Euler3 implements IPrimitive<Euler3> {
  constructor(public x = 0, public y = 0, public z = 0, public order: EulerOrder = EulerOrder.Default) {}

  getHashCode(): number {
    return hashFloat4(this.x, this.y, this.z, this.order as number);
  }

  set(x: number, y: number, z: number, order: EulerOrder): this {
    this.x = z;
    this.y = y;
    this.z = z;
    this.order = order;

    return this;
  }

  clone(): Euler3 {
    return new Euler3().copy(this);
  }

  copy(e: Euler3): this {
    this.x = e.x;
    this.y = e.y;
    this.z = e.z;
    this.order = e.order;

    return this;
  }

  setFromRotationMatrix4(m: Matrix4, order: EulerOrder = EulerOrder.Default): this {
    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

    const te = m.elements;
    const m11 = te[0],
      m12 = te[4],
      m13 = te[8];
    const m21 = te[1],
      m22 = te[5],
      m23 = te[9];
    const m31 = te[2],
      m32 = te[6],
      m33 = te[10];

    let x = 0,
      y = 0,
      z = 0;

    switch (order) {
      case EulerOrder.XYZ:
        y = Math.asin(clamp(m13, -1, 1));

        if (Math.abs(m13) < 0.9999999) {
          x = Math.atan2(-m23, m33);
          z = Math.atan2(-m12, m11);
        } else {
          x = Math.atan2(m32, m22);
          z = 0;
        }

        break;

      case EulerOrder.YXZ:
        x = Math.asin(-clamp(m23, -1, 1));

        if (Math.abs(m23) < 0.9999999) {
          y = Math.atan2(m13, m33);
          z = Math.atan2(m21, m22);
        } else {
          y = Math.atan2(-m31, m11);
          z = 0;
        }

        break;

      case EulerOrder.ZXY:
        x = Math.asin(clamp(m32, -1, 1));

        if (Math.abs(m32) < 0.9999999) {
          y = Math.atan2(-m31, m33);
          z = Math.atan2(-m12, m22);
        } else {
          y = 0;
          z = Math.atan2(m21, m11);
        }

        break;

      case EulerOrder.ZYX:
        y = Math.asin(-clamp(m31, -1, 1));

        if (Math.abs(m31) < 0.9999999) {
          x = Math.atan2(m32, m33);
          z = Math.atan2(m21, m11);
        } else {
          x = 0;
          z = Math.atan2(-m12, m22);
        }

        break;

      case EulerOrder.YZX:
        z = Math.asin(clamp(m21, -1, 1));

        if (Math.abs(m21) < 0.9999999) {
          x = Math.atan2(-m23, m22);
          y = Math.atan2(-m31, m11);
        } else {
          x = 0;
          y = Math.atan2(m13, m33);
        }

        break;

      case EulerOrder.XZY:
        z = Math.asin(-clamp(m12, -1, 1));

        if (Math.abs(m12) < 0.9999999) {
          x = Math.atan2(m32, m22);
          y = Math.atan2(m13, m11);
        } else {
          x = Math.atan2(-m23, m33);
          y = 0;
        }

        break;
    }

    this.set(x, y, z, order);

    return this;
  }

  setFromQuaternion(q: Quaternion, order = this.order): this {
    const m = new Matrix4().makeRotationFromQuaternion(q);

    return this.setFromRotationMatrix4(m, order);
  }

  equals(e: Euler3): boolean {
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
