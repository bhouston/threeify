import {
  Color3,
  color3MultiplyByScalar,
  Vec2,
  Vec3
} from '@threeify/vector-math';

import { SolidTextures } from '../textures/loaders/SolidTextures';
import { TextureAccessor } from '../textures/TextureAccessor';
import { AlphaMode } from './AlphaMode';
import { Material } from './Material';
import { MaterialParameters } from './MaterialParameters';

// Based on the Khronos PBR material.
// TODO: Add support for alpha blending

// TODO: This class has a lot of repetitive code. Unsure how to address this?  Maybe ask ChatGPT for help?

// This purposely does not extend IMaterialProps because it forcibly defined many of those props itself.
export interface IPhysicalMaterialProps {
  id?: string;
  name?: string;

  alpha?: number;
  alphaMode?: AlphaMode;
  alphaCutoff?: number;

  albedoFactor?: Color3;
  albedoAlphaTextureAccessor?: TextureAccessor;

  specularFactor?: number;
  specularFactorTextureAccessor?: TextureAccessor;

  specularColor?: Color3;
  specularColorTextureAccessor?: TextureAccessor;

  specularRoughnessFactor?: number;
  specularRoughnessTextureAccessor?: TextureAccessor;

  metallicFactor?: number;
  metallicTextureAccessor?: TextureAccessor;

  normalScale?: Vec2;
  normalTextureAccessor?: TextureAccessor;

  occlusionFactor?: number;
  occlusionTextureAccessor?: TextureAccessor;

  emissiveFactor?: Color3;
  emissiveTextureAccessor?: TextureAccessor;
  emissiveIntensity?: number;

  ior?: number;

  anisotropy?: number;
  anisotropyTextureAccessor?: TextureAccessor;
  anisotropyDirection?: Vec3;
  anisotropyDirectionTextureAccessor?: TextureAccessor;

  clearcoatFactor?: number;
  clearcoatRoughnessFactor?: number;
  clearcoatFactorRoughnessTextureAccessor?: TextureAccessor;
  clearcoatNormalScale?: Vec2;
  clearcoatNormalTextureAccessor?: TextureAccessor;

  clearcoatTint?: Color3;
  clearcoatTintTextureAccessor?: TextureAccessor;

  sheenColorFactor?: Color3;
  sheenRoughnessFactor?: number;
  sheenColorRoughnessTextureAccessor?: TextureAccessor;

  iridescenceFactor?: number;
  iridescenceIor?: number;
  iridescenceThicknessMinimum?: number;
  iridescenceThicknessMaximum?: number;
  iridescenceFactorThicknessTextureAccessor?: TextureAccessor;

  transmissionFactor?: number;
  transmissionTextureAccessor?: TextureAccessor;

  attenuationDistance?: number;
  attenuationColor?: Color3;
}

export class PhysicalMaterial extends Material {
  public alpha = 1;
  public alphaMode = AlphaMode.Opaque;
  public alphaCutoff = 0.5;

  public albedoFactor = new Color3(1, 1, 1);
  public albedoAlphaTextureAccessor?: TextureAccessor;

  public specularFactor = 1; // default validated from KHR_materials_specular
  public specularFactorTextureAccessor?: TextureAccessor;

  public specularColor = new Color3(1, 1, 1); // default validated from KHR_materials_specular
  public specularColorTextureAccessor?: TextureAccessor;

  public specularRoughnessFactor = 0.5;
  public specularRoughnessTextureAccessor?: TextureAccessor;

  public metallicFactor = 1;
  public metallicTextureAccessor?: TextureAccessor;

  public normalScale = new Vec2(1, 1);
  public normalTextureAccessor?: TextureAccessor;

  public occlusionFactor = 1;
  public occlusionTextureAccessor?: TextureAccessor;

  public emissiveFactor = new Color3(0, 0, 0);
  public emissiveTextureAccessor?: TextureAccessor;
  public emissiveIntensity = 1;

  public ior = 1.5; // default validated from KHR_materials_ior

  public anisotropy = 0;
  public anisotropyTextureAccessor?: TextureAccessor;
  public anisotropyDirection = new Vec3(0, 0, 1);
  public anisotropyDirectionTextureAccessor?: TextureAccessor;

  public clearcoatFactor = 0;
  public clearcoatRoughnessFactor = 0;
  public clearcoatFactorRoughnessTextureAccessor?: TextureAccessor;
  public clearcoatNormalScale = new Vec2(1, 1);
  public clearcoatNormalTextureAccessor?: TextureAccessor;

  public sheenColorFactor = new Color3(0, 0, 0);
  public sheenRoughnessFactor = 1;
  public sheenColorRoughnessTextureAccessor?: TextureAccessor;

  public iridescenceFactor = 0;
  public iridescenceIor = 1.5;
  public iridescenceThicknessMinimum = 0;
  public iridescenceThicknessMaximum = 0;
  public iridescenceFactorThicknessTextureAccessor?: TextureAccessor;

  public transmissionFactor = 0;
  public transmissionTextureAccessor?: TextureAccessor;

  public attenuationDistance = Number.POSITIVE_INFINITY;
  public attenuationColor = new Color3(1, 1, 1);

  constructor(props: IPhysicalMaterialProps) {
    super({
      id: props.id,
      name: props.name,
      shaderName: 'KhronosPhysicalMaterial'
    });

    if (props.alpha !== undefined) this.alpha = props.alpha;
    if (props.alphaMode !== undefined) this.alphaMode = props.alphaMode;
    if (props.alphaCutoff !== undefined) this.alphaCutoff = props.alphaCutoff;

    this.albedoFactor.copy(props.albedoFactor || this.albedoFactor);
    this.albedoAlphaTextureAccessor = props.albedoAlphaTextureAccessor;

    if (props.specularFactor !== undefined)
      this.specularFactor = props.specularFactor;
    this.specularFactorTextureAccessor = props.specularFactorTextureAccessor;

    this.specularColor.copy(props.specularColor || this.specularColor);
    this.specularColorTextureAccessor = props.specularColorTextureAccessor;

    if (props.specularRoughnessFactor !== undefined)
      this.specularRoughnessFactor = props.specularRoughnessFactor;
    this.specularRoughnessTextureAccessor =
      props.specularRoughnessTextureAccessor;

    if (props.metallicFactor !== undefined)
      this.metallicFactor = props.metallicFactor;
    this.metallicTextureAccessor = props.metallicTextureAccessor;

    this.normalScale.copy(props.normalScale || this.normalScale);
    this.normalTextureAccessor = props.normalTextureAccessor;

    if (props.occlusionFactor !== undefined)
      this.occlusionFactor = props.occlusionFactor;
    this.occlusionTextureAccessor = props.occlusionTextureAccessor;

    this.emissiveFactor.copy(props.emissiveFactor || this.emissiveFactor);
    this.emissiveTextureAccessor = props.emissiveTextureAccessor;
    if (props.emissiveIntensity !== undefined)
      this.emissiveIntensity = props.emissiveIntensity;

    if (props.ior !== undefined) this.ior = props.ior;

    if (props.anisotropy !== undefined) this.anisotropy = props.anisotropy;
    this.anisotropyTextureAccessor = props.anisotropyTextureAccessor;
    this.anisotropyDirection.copy(
      props.anisotropyDirection || this.anisotropyDirection
    );
    this.anisotropyDirectionTextureAccessor =
      props.anisotropyDirectionTextureAccessor;

    if (props.clearcoatFactor !== undefined)
      this.clearcoatFactor = props.clearcoatFactor;
    if (props.clearcoatRoughnessFactor !== undefined)
      this.clearcoatRoughnessFactor = props.clearcoatRoughnessFactor;
    this.clearcoatFactorRoughnessTextureAccessor =
      props.clearcoatFactorRoughnessTextureAccessor;
    this.clearcoatNormalScale.copy(
      props.clearcoatNormalScale || this.clearcoatNormalScale
    );
    this.clearcoatNormalTextureAccessor = props.clearcoatNormalTextureAccessor;

    this.sheenColorFactor.copy(props.sheenColorFactor || this.sheenColorFactor);
    if (props.sheenRoughnessFactor !== undefined)
      this.sheenRoughnessFactor = props.sheenRoughnessFactor;
    this.sheenColorRoughnessTextureAccessor =
      props.sheenColorRoughnessTextureAccessor;

    if (props.iridescenceFactor !== undefined)
      this.iridescenceFactor = props.iridescenceFactor;
    if (props.iridescenceIor !== undefined)
      this.iridescenceIor = props.iridescenceIor;
    if (props.iridescenceThicknessMinimum !== undefined)
      this.iridescenceThicknessMinimum = props.iridescenceThicknessMinimum;
    if (props.iridescenceThicknessMaximum !== undefined)
      this.iridescenceThicknessMaximum = props.iridescenceThicknessMaximum;
    this.iridescenceFactorThicknessTextureAccessor =
      props.iridescenceFactorThicknessTextureAccessor;

    if (props.transmissionFactor !== undefined)
      this.transmissionFactor = props.transmissionFactor;
    this.transmissionTextureAccessor = props.transmissionTextureAccessor;

    if (props.attenuationDistance !== undefined)
      this.attenuationDistance = props.attenuationDistance;
    this.attenuationColor.copy(props.attenuationColor || this.attenuationColor);
  }

  getParameters(): MaterialParameters {
    return {
      alpha: this.alpha,
      alphaMode: this.alphaMode,
      alphaCutoff: this.alphaCutoff,

      albedoFactor: this.albedoFactor,
      albedoAlphaTextureAccessor:
        this.albedoAlphaTextureAccessor ||
        new TextureAccessor(SolidTextures.White),

      specularFactor: this.specularFactor,
      specularFactorTextureAccessor:
        this.specularFactorTextureAccessor ||
        new TextureAccessor(SolidTextures.White),

      specularColor: this.specularColor,
      specularColorTextureAccessor:
        this.specularColorTextureAccessor ||
        new TextureAccessor(SolidTextures.White),

      specularRoughnessFactor: this.specularRoughnessFactor,
      specularRoughnessTextureAccessor:
        this.specularRoughnessTextureAccessor ||
        new TextureAccessor(SolidTextures.White),

      metallicFactor: this.metallicFactor,
      metallicTextureAccessor:
        this.metallicTextureAccessor ||
        new TextureAccessor(SolidTextures.White),

      normalScale: this.normalScale,
      normalTextureAccessor:
        this.normalTextureAccessor ||
        new TextureAccessor(SolidTextures.FlatNormal),

      occlusionFactor: this.occlusionFactor,
      occlusionTextureAccessor:
        this.occlusionTextureAccessor ||
        new TextureAccessor(SolidTextures.White),

      emissiveFactor: color3MultiplyByScalar(
        this.emissiveFactor,
        this.emissiveIntensity
      ),
      emissiveTextureAccessor:
        this.emissiveTextureAccessor ||
        new TextureAccessor(SolidTextures.White),

      ior: this.ior,

      anisotropy: this.anisotropy,
      anisotropyTextureAccessor:
        this.anisotropyTextureAccessor ||
        new TextureAccessor(SolidTextures.White),
      anisotropyDirection: this.anisotropyDirection,
      anisotropyDirectionTextureAccessor:
        this.anisotropyDirectionTextureAccessor ||
        new TextureAccessor(SolidTextures.NeutralDirection),

      clearcoatFactor: this.clearcoatFactor,
      clearcoatRoughnessFactor: this.clearcoatRoughnessFactor,
      clearcoatFactorRoughnessTextureAccessor:
        this.clearcoatFactorRoughnessTextureAccessor ||
        new TextureAccessor(SolidTextures.White),
      clearcoatNormalScale: this.clearcoatNormalScale,
      clearcoatNormalTextureAccessor:
        this.clearcoatNormalTextureAccessor ||
        new TextureAccessor(SolidTextures.FlatNormal),

      sheenColorFactor: this.sheenColorFactor,
      sheenRoughnessFactor: this.sheenRoughnessFactor,
      sheenColorRoughnessTextureAccessor:
        this.sheenColorRoughnessTextureAccessor ||
        new TextureAccessor(SolidTextures.White),

      iridescenceFactor: this.iridescenceFactor,
      iridescenceIor: this.iridescenceIor,
      iridescenceThicknessMinimum: this.iridescenceThicknessMinimum,
      iridescenceThicknessMaximum: this.iridescenceThicknessMaximum,
      iridescenceFactorThicknessTextureAccessor:
        this.iridescenceFactorThicknessTextureAccessor ||
        new TextureAccessor(SolidTextures.White),

      transmissionFactor: this.transmissionFactor,
      transmissionTextureAccessor:
        this.transmissionTextureAccessor ||
        new TextureAccessor(SolidTextures.White),

      attenuationDistance: this.attenuationDistance,
      attenuationColor: this.attenuationColor
    };
  }
}
