import { IArrayable } from "../../core/types";
import { Vector3 } from "../Vector3";

export class PrimitiveArray<P extends IArrayable> {
  readonly floatArray: Float32Array;
  readonly count: number;

  constructor(value: number | ArrayBuffer | Float32Array, public componentsPerPrimitive: number) {
    if (typeof value === "number") {
      this.floatArray = new Float32Array(value * this.componentsPerPrimitive);
    } else if (value instanceof Float32Array) {
      this.floatArray = value;
    } else if (value instanceof ArrayBuffer) {
      this.floatArray = new Float32Array(value);
    } else {
      throw new Error("unsupported value");
    }
    this.count = this.floatArray.length / this.componentsPerPrimitive;
  }

  set(index: number, v: P): this {
    v.toArray(this.floatArray, index * this.componentsPerPrimitive);
    return this;
  }

  get(index: number, v: P): P {
    v.setFromArray(this.floatArray, index * this.componentsPerPrimitive);
    return v;
  }
}

export class Vector3Array extends PrimitiveArray<Vector3> {
  #temp = new Vector3();

  constructor(count: number);
  constructor(floatArray: Float32Array);
  constructor(arrayBuffer: ArrayBuffer);
  constructor(value: number | ArrayBuffer | Float32Array) {
    super(value, 3);
  }

  add(index: number, v: Vector3): this {
    return this.set(index, this.get(index, this.#temp).add(v));
  }
}
