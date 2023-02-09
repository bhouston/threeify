import { Texture } from '@threeify/core';
import {
  Color3,
  Color4,
  Mat3,
  Mat4,
  Vec2,
  Vec3,
  Vec4
} from '@threeify/math';

export type MaterialPropertyValue =
  | number
  | Vec2
  | Vec3
  | Vec4
  | Color3
  | Color4
  | Mat3
  | Mat4
  | Texture
  | IMaterialParameterProvider;

export interface IMaterialParameterProvider {
  getParameters(): MaterialParameters;
}

export type MaterialParameters = {
  [parameterName: string]: MaterialPropertyValue;
};
