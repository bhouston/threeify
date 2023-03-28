import { SolidTextures } from '@threeify/core';
import { Color3, Vec2, Vec3 } from '@threeify/math';

import { Material } from './Material.js';
import { MaterialParameters } from './MaterialParameters.js';
import { PhysicalMaterial } from './PhysicalMaterial.js';
import { TextureAccessor } from './TextureAccessor.js';

// Based on the Khronos PBR material.
// TODO: Add support for alpha blending

// TODO: This class has a lot of repetitive code. Unsure how to address this?  Maybe ask ChatGPT for help?

// This purposely does not extend IMaterialProps because it forcibly defined many of those props itself.
export interface IGemMaterialProps {
  id?: string;
  name?: string;

  normalScale?: Vec2;
  normalTextureAccessor?: TextureAccessor;

  occlusionFactor?: number;
  occlusionTextureAccessor?: TextureAccessor;

  ior?: number;

  attenuationDistance?: number;
  attenuationColor?: Color3;

  gemSquishFactor?: Vec3;
  gemBoostFactor?: number;
  gemNormalCubeMapId?: number;
}

export class GemMaterial extends Material {
  public normalScale = new Vec2(1, 1);
  public normalTextureAccessor?: TextureAccessor;

  public occlusionFactor = 1;
  public occlusionTextureAccessor?: TextureAccessor;

  // https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_ior/README.md
  public ior = 1.5;

  // https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_volume/README.md
  public attenuationDistance = Number.POSITIVE_INFINITY;
  public attenuationColor = Color3.White;

  public gemSquishFactor = new Vec3(1, 1, 1);
  public gemBoostFactor = 0;
  public gemNormalCubeMapId = -1;

  constructor(props: IGemMaterialProps) {
    super({
      id: props.id,
      name: props.name,
      shaderName: 'gem'
    });

    this.normalScale.copy(props.normalScale || this.normalScale);
    this.normalTextureAccessor = props.normalTextureAccessor;

    if (props.occlusionFactor !== undefined)
      this.occlusionFactor = props.occlusionFactor;
    this.occlusionTextureAccessor = props.occlusionTextureAccessor;

    if (props.ior !== undefined) this.ior = props.ior;

    if (props.attenuationDistance !== undefined)
      this.attenuationDistance = props.attenuationDistance;
    this.attenuationColor.copy(props.attenuationColor || this.attenuationColor);

    if (props.gemSquishFactor !== undefined)
      this.gemSquishFactor = props.gemSquishFactor;
    if (props.gemBoostFactor !== undefined)
      this.gemBoostFactor = props.gemBoostFactor;
    if (props.gemNormalCubeMapId !== undefined)
      this.gemNormalCubeMapId = props.gemNormalCubeMapId;
  }

  getParameters(): MaterialParameters {
    return {
      normalScale: this.normalScale,
      normalTextureAccessor:
        this.normalTextureAccessor ||
        new TextureAccessor(SolidTextures.FlatNormal),

      occlusionFactor: this.occlusionFactor,
      occlusionTextureAccessor:
        this.occlusionTextureAccessor ||
        new TextureAccessor(SolidTextures.White),

      ior: this.ior,

      attenuationDistance: this.attenuationDistance,
      attenuationColor: this.attenuationColor,

      gemSquishFactor: this.gemSquishFactor,
      gemBoostFActory: this.gemBoostFactor,
      gemNormalCubeMapId: this.gemNormalCubeMapId
    };
  }
}

export function physicalToGemMaterial(
  physicalMaterial: PhysicalMaterial
): GemMaterial {
  return new GemMaterial({
    id: physicalMaterial.id,
    name: physicalMaterial.name,

    normalScale: physicalMaterial.normalScale,
    normalTextureAccessor: physicalMaterial.normalTextureAccessor,

    occlusionFactor: physicalMaterial.occlusionFactor,
    occlusionTextureAccessor: physicalMaterial.occlusionTextureAccessor,

    ior: physicalMaterial.ior,

    attenuationDistance: physicalMaterial.attenuationDistance,
    attenuationColor: physicalMaterial.attenuationColor

    /*gemSquishFactor: physicalMaterial.gemSquishFactor,
    gemBoostFactor: physicalMaterial.gemBoostFactor,
    gemNormalCubeMapId: physicalMaterial.gemNormalCubeMapId*/
  });
}
