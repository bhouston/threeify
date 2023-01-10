import { IArrayable } from '../../core/types.js';
import { Attribute } from '../../geometry/Attribute.js';
import { Mat3 } from '../Mat3.js';
import { Mat4 } from '../Mat4.js';
import { Quat } from '../Quat.js';
import { vec2Add } from '../Vec2.Functions.js';
import { Vec2 } from '../Vec2.js';
import { vec3Add } from '../Vec3.Functions.js';
import { Vec3 } from '../Vec3.js';

type DataArray = Attribute | ArrayBuffer | Float32Array;

export class PrimitiveView<P extends IArrayable> {
  readonly floatArray: Float32Array;
  readonly count: number;

  constructor(
    dataArray: DataArray,
    floatPerPrimitive = -1,
    public floatStride: number = -1,
    public floatOffset: number = -1
  ) {
    if (dataArray instanceof Attribute) {
      if (this.floatStride >= 0) {
        throw new Error(
          'can not specify explicit byteStride when using Attribute argument'
        );
      }
      if (this.floatOffset >= 0) {
        throw new Error(
          'can not specify explicit byteOffset when using Attribute argument'
        );
      }
      this.floatOffset = dataArray.byteOffset / 4;
      this.floatStride = dataArray.vertexStride / 4;
      this.floatArray = new Float32Array(dataArray.attributeData.arrayBuffer);
    } else if (dataArray instanceof Float32Array) {
      this.floatArray = dataArray;
    } else if (dataArray instanceof ArrayBuffer) {
      this.floatArray = new Float32Array(dataArray);
    } else {
      throw new TypeError('unsupported value');
    }
    if (floatPerPrimitive < 0) {
      throw new Error(
        'must specify bytesPerPrimitive or provide an Attribute argument'
      );
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
    v.setFromArray(
      this.floatArray,
      index * this.floatStride + this.floatOffset
    );
    return v;
  }
}

export class Vec2View extends PrimitiveView<Vec2> {
  readonly tempPrimitive = new Vec2();

  constructor(dataArray: DataArray, floatStride = -1, floatOffset = -1) {
    super(dataArray, 2, floatStride, floatOffset);
  }

  add(index: number, v: Vec2): this {
    return this.set(
      index,
      vec2Add(this.get(index, this.tempPrimitive), v, this.tempPrimitive)
    );
  }
}

export class Vec3View extends PrimitiveView<Vec3> {
  readonly tempPrimitive = new Vec3();

  constructor(dataArray: DataArray, floatStride = -1, floatOffset = -1) {
    super(dataArray, 3, floatStride, floatOffset);
  }

  add(index: number, v: Vec3): this {
    return this.set(
      index,
      vec3Add(this.get(index, this.tempPrimitive), v, this.tempPrimitive)
    );
  }
}

export function makeVec2View(
  dataArray: DataArray,
  floatStride = -1,
  floatOffset = -1
): Vec2View {
  return new Vec2View(dataArray, floatStride, floatOffset);
}
export function makeVec3View(
  dataArray: DataArray,
  floatStride = -1,
  floatOffset = -1
): Vec3View {
  return new Vec3View(dataArray, floatStride, floatOffset);
}
export function makeQuatView(
  dataArray: DataArray,
  floatStride = -1,
  floatOffset = -1
): PrimitiveView<Quat> {
  return new PrimitiveView<Quat>(dataArray, 4, floatStride, floatOffset);
}
export function makeMat3View(
  dataArray: DataArray,
  floatStride = -1,
  floatOffset = -1
): PrimitiveView<Mat3> {
  return new PrimitiveView<Mat3>(dataArray, 9, floatStride, floatOffset);
}
export function makeMat4View(
  dataArray: DataArray,
  floatStride = -1,
  floatOffset = -1
): PrimitiveView<Mat4> {
  return new PrimitiveView<Mat4>(dataArray, 16, floatStride, floatOffset);
}
