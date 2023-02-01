import { TexImage2D } from '@threeify/core';
import { Color3, Vec3 } from '@threeify/vector-math';

export class LightParameters {
  public domeCubeMap?: TexImage2D;
  public domeIntensity = new Color3(1, 1, 1);

  public numPunctualLights = 0;
  public punctualLightType: number[] = [];
  public punctualLightWorldPosition: Vec3[] = [];
  public punctualLightWorldDirection: Vec3[] = [];
  public punctualLightIntensity: Color3[] = [];
  public punctualLightRange: number[] = [];
  public punctualLightInnerCos: number[] = [];
  public punctualLightOuterCos: number[] = [];
}
