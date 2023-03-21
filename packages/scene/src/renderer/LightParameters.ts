import { TexImage2D } from '@threeify/core';
import { Color3, Vec3 } from '@threeify/math';

/*export type IBLMap = {
  texture?: TexImage2D;
  intensity: Color3;
  maxLod: number;
};*/

export class LightParameters {
  public iblWorldMap?: TexImage2D = undefined;
  public iblIntensity: Color3 = Color3.White;
  public iblMipCount = 9;
  public numPunctualLights = 0;
  public punctualLightType: number[] = [];
  public punctualLightWorldPosition: Vec3[] = [];
  public punctualLightWorldDirection: Vec3[] = [];
  public punctualLightIntensity: Color3[] = [];
  public punctualLightRange: number[] = [];
  public punctualLightInnerCos: number[] = [];
  public punctualLightOuterCos: number[] = [];
}
