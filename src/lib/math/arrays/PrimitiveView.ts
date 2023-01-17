import { Attribute } from '../../geometry/Attribute.js';
import { mat3FromArray, mat3ToArray } from '../Mat3.Functions.js';
import { Mat3 } from '../Mat3.js';
import { mat4FromArray, mat4ToArray } from '../Mat4.Functions.js';
import { Mat4 } from '../Mat4.js';
import { quatFromArray, quatToArray } from '../Quat.Functions.js';
import { Quat } from '../Quat.js';
import { vec2FromArray, vec2ToArray } from '../Vec2.Functions.js';
import { Vec2 } from '../Vec2.js';
import { vec3FromArray, vec3ToArray } from '../Vec3.Functions.js';
import { Vec3 } from '../Vec3.js';

type DataArray = Attribute | ArrayBuffer | Float32Array;

export class PrimitiveView<PrimitiveType> {
  readonly floatArray: Float32Array;
  readonly count: number;

  constructor(
    dataArray: DataArray,
    floatPerPrimitive = -1,
    public floatStride: number = -1,
    public floatOffset: number = -1,
    private primitiveToArray: (
      p: PrimitiveType,
      a: Float32Array,
      i: number
    ) => void,
    private arrayToPrimitive: (
      a: Float32Array,
      i: number,
      p: PrimitiveType
    ) => void
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

  set(index: number, v: PrimitiveType): this {
    this.primitiveToArray(
      v,
      this.floatArray,
      index * this.floatStride + this.floatOffset
    );
    return this;
  }

  get(index: number, v: PrimitiveType): PrimitiveType {
    this.arrayToPrimitive(
      this.floatArray,
      index * this.floatStride + this.floatOffset,
      v
    );
    return v;
  }

  clear(): this {
    this.floatArray.fill(0);
    return this;
  }
}

export function makeVec2View(
  dataArray: DataArray,
  floatStride = -1,
  floatOffset = -1
): PrimitiveView<Vec2> {
  return new PrimitiveView<Vec2>(
    dataArray,
    2,
    floatStride,
    floatOffset,
    vec2ToArray,
    vec2FromArray
  );
}
export function makeVec3View(
  dataArray: DataArray,
  floatStride = -1,
  floatOffset = -1
): PrimitiveView<Vec3> {
  return new PrimitiveView<Vec3>(
    dataArray,
    3,
    floatStride,
    floatOffset,
    vec3ToArray,
    vec3FromArray
  );
}
export function makeQuatView(
  dataArray: DataArray,
  floatStride = -1,
  floatOffset = -1
): PrimitiveView<Quat> {
  return new PrimitiveView<Quat>(
    dataArray,
    4,
    floatStride,
    floatOffset,
    quatToArray,
    quatFromArray
  );
}
export function makeMat3View(
  dataArray: DataArray,
  floatStride = -1,
  floatOffset = -1
): PrimitiveView<Mat3> {
  return new PrimitiveView<Mat3>(
    dataArray,
    9,
    floatStride,
    floatOffset,
    mat3ToArray,
    mat3FromArray
  );
}
export function makeMat4View(
  dataArray: DataArray,
  floatStride = -1,
  floatOffset = -1
): PrimitiveView<Mat4> {
  return new PrimitiveView<Mat4>(
    dataArray,
    16,
    floatStride,
    floatOffset,
    mat4ToArray,
    mat4FromArray
  );
}
