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

export class ColorArray extends PrimitiveArray<Color> {
  constructor(dataArray: DataArray, byteStride = -1, byteOffset = -1) {
    super(dataArray, 12, byteStride, byteOffset);
  }
}

export class QuaternionArray extends PrimitiveArray<Quaternion> {
  constructor(dataArray: DataArray, byteStride = -1, byteOffset = -1) {
    super(dataArray, 16, byteStride, byteOffset);
  }
}

export class Matrix3Array extends PrimitiveArray<Matrix3> {
  constructor(dataArray: DataArray, byteStride = -1, byteOffset = -1) {
    super(dataArray, 36, byteStride, byteOffset);
  }
}

export class Matrix4Array extends PrimitiveArray<Matrix4> {
  constructor(dataArray: DataArray, byteStride = -1, byteOffset = -1) {
    super(dataArray, 64, byteStride, byteOffset);
  }
}
