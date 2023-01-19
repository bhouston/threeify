import { Color3, Color4, Mat3, Mat4, Texture, Vec2, Vec3, Vec4 } from '..';

export type MaterialPropertyValue =
  | number
  | Vec2
  | Vec3
  | Vec4
  | Color3
  | Color4
  | Mat3
  | Mat4
  | Texture;

export type MaterialParameters = {
  [parameterName: string]: MaterialPropertyValue;
};
