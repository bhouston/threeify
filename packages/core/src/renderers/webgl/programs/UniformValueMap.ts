import { Color3 } from '../../../math/Color3';
import { Color4 } from '../../../math/Color4';
import { Mat3 } from '../../../math/Mat3';
import { Mat4 } from '../../../math/Mat4';
import { Vec2 } from '../../../math/Vec2';
import { Vec3 } from '../../../math/Vec3';
import { Vec4 } from '../../../math/Vec4';
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
