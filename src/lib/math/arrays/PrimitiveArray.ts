import { IArrayable } from "../../core/types";
import { Attribute } from "../../geometry/Attribute";
import { Color } from "../Color";
import { Matrix3 } from "../Matrix3";
import { Matrix4 } from "../Matrix4";
import { Quaternion } from "../Quaternion";
import { Vector2 } from "../Vector2";
import { Vector3 } from "../Vector3";

type DataArray = Attribute | ArrayBuffer | Float32Array;

export class PrimitiveArray<P extends IArrayable> {
  readonly floatArray: Float32Array;
  readonly count: number;

  constructor(
    dataArray: DataArray,
    floatPerPrimitive = -1,
    public floatStride: number = -1,
    public floatOffset: number = -1,
  ) {
    if (dataArray instanceof Attribute) {
      if (this.floatStride >= 0) {
        throw new Error("can not specify explicit byteStride when using Attribute argument");
      }
      if (this.floatOffset >= 0) {
        throw new Error("can not specify explicit byteOffset when using Attribute argument");
      }
      this.floatOffset = dataArray.byteOffset / 4;
      this.floatStride = dataArray.vertexStride / 4;
      this.floatArray = new Float32Array(dataArray.attributeData.arrayBuffer);
    } else if (dataArray instanceof Float32Array) {
      this.floatArray = dataArray;
    } else if (dataArray instanceof ArrayBuffer) {
      this.floatArray = new Float32Array(dataArray);
    } else {
      throw new Error("unsupported value");
    }
    if (floatPerPrimitive < 0) {
      throw new Error("must specify bytesPerPrimitive or provide an Attribute argument");
    }
    if (this.floatStride < 0) {
      this.floatStride = floatPerPrimitive;
    }
    if (this.floatOffset < 0) {
      this.floatOffset = 0;
    }
    this.count = this.floatArray.length / this.floatStride;
  }

  set(index: number, v: P): this {
    v.toArray(this.floatArray, index * this.floatStride + this.floatOffset);
    return this;
  }

  get(index: number, v: P): P {
    v.setFromArray(this.floatArray, index * this.floatStride + this.floatOffset);
    return v;
  }
}

export class Vector2Array extends PrimitiveArray<Vector2> {
  readonly tempPrimitive = new Vector2();

  constructor(dataArray: DataArray, byteStride = -1, byteOffset = -1) {
    super(dataArray, 8, byteStride, byteOffset);
  }

  add(index: number, v: Vector2): this {
    return this.set(index, this.get(index, this.tempPrimitive).add(v));
  }
}

export class Vector3Array extends PrimitiveArray<Vector3> {
  readonly tempPrimitive = new Vector3();

  constructor(dataArray: DataArray, byteStride = -1, byteOffset = -1) {
    super(dataArray, 12, byteStride, byteOffset);
  }

  add(index: number, v: Vector3): this {
    return this.set(index, this.get(index, this.tempPrimitive).add(v));
  }
}

export function makeVector2Array(dataArray: DataArray, byteStride = -1, byteOffset = -1): Vector2Array {
  return new Vector2Array(dataArray, byteStride, byteOffset);
}
export function makeVector3Array(dataArray: DataArray, byteStride = -1, byteOffset = -1): Vector3Array {
  return new Vector3Array(dataArray, byteStride, byteOffset);
}
export function makeColorArray(dataArray: DataArray, byteStride = -1, byteOffset = -1): PrimitiveArray<Color> {
  return new PrimitiveArray<Color>(dataArray, 12, byteStride, byteOffset);
}
export function makeQuaternionArray(
  dataArray: DataArray,
  byteStride = -1,
  byteOffset = -1,
): PrimitiveArray<Quaternion> {
  return new PrimitiveArray<Quaternion>(dataArray, 16, byteStride, byteOffset);
}
export function makeMatrix3Array(dataArray: DataArray, byteStride = -1, byteOffset = -1): PrimitiveArray<Matrix3> {
  return new PrimitiveArray<Matrix3>(dataArray, 36, byteStride, byteOffset);
}
export function makeMatrix4Array(dataArray: DataArray, byteStride = -1, byteOffset = -1): PrimitiveArray<Matrix4> {
  return new PrimitiveArray<Matrix4>(dataArray, 64, byteStride, byteOffset);
}
