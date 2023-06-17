import { arrayToMat3, mat3ToArray } from '../Mat3.Functions';
import { Mat3 } from '../Mat3';
import { arrayToMat4, mat4ToArray } from '../Mat4.Functions';
import { Mat4 } from '../Mat4';
import { arrayToQuat, quatToArray } from '../Quat.Functions';
import { Quat } from '../Quat';
import { arrayToVec2, vec2ToArray } from '../Vec2.Functions';
import { Vec2 } from '../Vec2';
import { arrayToVec3, vec3ToArray } from '../Vec3.Functions';
import { Vec3 } from '../Vec3';

type DataArray = ArrayBuffer | Float32Array;

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
    if (dataArray instanceof Float32Array) {
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
    arrayToVec2
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
    arrayToVec3
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
    arrayToQuat
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
    arrayToMat3
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
    arrayToMat4
  );
}
