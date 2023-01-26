import { GL } from '../GL.js';

export enum UniformType {
  Bool = GL.BOOL,
  BoolVec2 = GL.BOOL_VEC2,
  BoolVec3 = GL.BOOL_VEC3,
  BoolVec4 = GL.BOOL_VEC4,
  Int = GL.INT,
  IntVec2 = GL.INT_VEC2,
  IntVec3 = GL.INT_VEC3,
  IntVec4 = GL.INT_VEC4,
  Float = GL.FLOAT,
  FloatVec2 = GL.FLOAT_VEC2,
  FloatVec3 = GL.FLOAT_VEC3,
  FloatVec4 = GL.FLOAT_VEC4,
  FloatMat2 = GL.FLOAT_MAT2,
  // FloatMat2x3 = GL2.FLOAT_MAT2x3,
  // FloatMat2x4 = GL2.FLOAT_MAT2x4,
  // FloatMat3x2 = GL2.FLOAT_MAT3x2,
  FloatMat3 = GL.FLOAT_MAT3,
  // FloatMat3x4 = GL2.FLOAT_MAT3x4,
  // FloatMat4x2 = GL2.FLOAT_MAT4x3,
  // FloatMat4x3 = GL2.FLOAT_MAT4x3,
  FloatMat4 = GL.FLOAT_MAT4,
  // setValueT1;
  Sampler2D = GL.SAMPLER_2D,
  // IntSampler2D = GL2.INT_SAMPLER_2D,
  // UnsignedIntSampler2D = GL2.UNSIGNED_INT_SAMPLER_2D,
  // Sampler2DShadow = GL2.SAMPLER_2D_SHADOW,
  // setValueT3D1;
  // Sampler3D = GL2.SAMPLER_3D,
  // IntSampler3D = GL2.INT_SAMPLER_3D,
  // UnsignedIntSampler3D = GL2.UNSIGNED_INT_SAMPLER_3D,
  // setValueT6
  SamplerCube = GL.SAMPLER_CUBE,
  // IntSamplerCube = GL2.INT_SAMPLER_CUBE,
  // UnsignedIntSamplerCube = GL2.UNSIGNED_INT_SAMPLER_CUBE,
  // SamplerCubeShadow = GL2.SAMPLER_CUBE_SHADOW,
  // setValueT2DArray1
  Sampler2DArray = GL.SAMPLER_2D_ARRAY
  // IntSampler2DArray = GL2.INT_SAMPLER_2D_ARRAY,
  // UnsignedIntSampler2DArray = GL2.UNSIGNED_INT_SAMPLER_2D_ARRAY,
  // Sampler2DArrayShadow = GL2.SAMPLER_2D_ARRAY_SHADOW,
}

export class UniformTypeInfo {
  constructor(
    public readonly numElements: number,
    public readonly bytesPerElement: number,
    public readonly glType: number
  ) {}
}

const uniformTypeToInfo = new Map<UniformType, UniformTypeInfo>([
  [UniformType.Bool, new UniformTypeInfo(1, 1, GL.BOOL)],
  [UniformType.Int, new UniformTypeInfo(1, 4, GL.INT)],
  [UniformType.Float, new UniformTypeInfo(1, 4, GL.FLOAT)],
  [UniformType.BoolVec2, new UniformTypeInfo(2, 1, GL.BOOL)],
  [UniformType.IntVec2, new UniformTypeInfo(2, 4, GL.INT)],
  [UniformType.FloatVec2, new UniformTypeInfo(2, 4, GL.FLOAT)],
  [UniformType.BoolVec3, new UniformTypeInfo(3, 1, GL.BOOL)],

  [UniformType.IntVec3, new UniformTypeInfo(3, 4, GL.INT)],
  [UniformType.FloatVec3, new UniformTypeInfo(3, 4, GL.FLOAT)],
  [UniformType.BoolVec4, new UniformTypeInfo(4, 1, GL.BOOL)],
  [UniformType.IntVec4, new UniformTypeInfo(4, 4, GL.INT)],
  [UniformType.FloatVec4, new UniformTypeInfo(4, 4, GL.FLOAT)],
  [UniformType.FloatMat2, new UniformTypeInfo(4, 4, GL.FLOAT)],
  [UniformType.FloatMat3, new UniformTypeInfo(9, 4, GL.FLOAT)],
  [UniformType.FloatMat4, new UniformTypeInfo(16, 4, GL.FLOAT)],
  [UniformType.Sampler2D, new UniformTypeInfo(1, 4, GL.SAMPLER_2D)],
  [UniformType.SamplerCube, new UniformTypeInfo(1, 4, GL.SAMPLER_CUBE)]
]);

export function uniformTypeInfo(uniformType: UniformType): UniformTypeInfo {
  if (uniformTypeToInfo.has(uniformType)) {
    return uniformTypeToInfo.get(uniformType)!;
  }
  throw new Error('Unknown uniform type: ' + uniformType);
}

export function numTextureUnits(uniformType: UniformType): number {
  switch (uniformType) {
    case UniformType.Sampler2D:
      // case UniformType.IntSampler2D:
      // case UniformType.UnsignedIntSampler2D:
      // case UniformType.Sampler2DShadow:
      return 1;

    // case UniformType.Sampler3D:
    // case UniformType.IntSampler3D:
    // case UniformType.UnsignedIntSampler3D:
    //  return 1;

    case UniformType.SamplerCube:
      // case UniformType.IntSamplerCube:
      // case UniformType.UnsignedIntSamplerCube:
      // case UniformType.SamplerCubeShadow:
      return 1; // cube textures only take one slot

    case UniformType.Sampler2DArray:
      return 1;

    // case UniformType.IntSampler2DArray:
    // case UniformType.UnsignedIntSampler2DArray:
    // case UniformType.Sampler2DArrayShadow:
    //  return 1;

    default:
      return 0;
  }
}
