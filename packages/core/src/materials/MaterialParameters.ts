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
  | Texture
  | IMaterialParametersProvider;

export interface IMaterialParametersProvider {
  getParameters(): MaterialParameters;
}

export type MaterialParameters = {
  [parameterName: string]: MaterialPropertyValue;
};
