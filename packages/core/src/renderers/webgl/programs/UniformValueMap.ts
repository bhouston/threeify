import { Color3, Color4, Mat3, Mat4, Vec2, Vec3, Vec4 } from '@threeify/math';

import { TexImage2D } from '../textures/TexImage2D';

// TODO: Compile arrays of Vec2, Vec3, Vec4, Color3, Color4 into linear Float32Arrays for faster setting
export type UniformPrimitiveValue =
  | number
  | Vec2
  | Vec3
  | Vec4
  | Color3
  | Color4
  | Mat3
  | Mat4;

export type UniformValue =
  | UniformPrimitiveValue
  | UniformPrimitiveValue[]
  | TexImage2D
  | TexImage2D[];

export type UniformValueMap = { [key: string]: UniformValue };
