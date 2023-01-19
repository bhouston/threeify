import { Color3 } from '../math/Color3';
import { color3MultiplyByScalar } from '../math/Color3.Functions';
import { Vec2 } from '../math/Vec2';
import { Vec3 } from '../math/Vec3';
import { SolidTextures } from '../textures/loaders/SolidTextures';
import { Texture } from '../textures/Texture';
import { Material } from './Material';
import { MaterialParameters } from './MaterialParameters';

// Based on the Khronos PBR material.
// TODO: Add support for alpha blending

// TODO: This class has a lot of repetitive code. Unsure how to address this?  Maybe ask ChatGPT for help?
export interface IPhysicalMaterialProps {
  id?: string;
  name?: string;

  alpha?: number;
  alphaTexture?: Texture;

  albedo?: Color3;
  albedoTexture?: Texture;

  specularFactor?: number;
  specularFactorTexture?: Texture;

  specularColor?: Color3;
  specularColorTexture?: Texture;

  specularRoughness?: number;
  specularRoughnessTexture?: Texture;

  metallic?: number;
  metallicTexture?: Texture;

  normalScale?: Vec2;
  normalTexture?: Texture;

  emissiveColor?: Color3;
  emissiveTexture?: Texture;
  emissiveIntensity?: number;

  ior?: number;

  anisotropy?: number;
  anisotropyTexture?: Texture;
  anisotropyDirection?: Vec3;
  anisotropyDirectionTexture?: Texture;

  clearcoatFactor?: number;
  clearcoatTexture?: Texture;
  clearcoatRoughnessFactor?: number;
  clearcoatRoughnessTexture?: Texture;
  clearcoatNormalScale?: Vec2;
  clearcoatNormalTexture?: Texture;

  clearcoatTint?: Color3;
  clearcoatTintTexture?: Texture;

  sheenColorFactor?: Color3;
  sheenColorTexture?: Texture;
  sheenRoughnessFactor?: number;
  sheenRoughnessTexture?: Texture;

  iridescenceFactor?: number;
  iridescenceTexture?: Texture;
  iridescenceIor?: number;
  iridescenceThicknessMinimum?: number;
  iridescenceThicknessMaximum?: number;
  iridescenceThicknessTexture?: Texture;

  transmissionFactor?: number;
  transmissionTexture?: Texture;

  attenuationDistance?: number;
  attenuationColor?: Color3;
}

export class PhysicalMaterial extends Material {
  public alpha = 1;
  public alphaTexture?: Texture;

  public albedo = new Color3(1, 1, 1);
  public albedoTexture?: Texture;

  public specularFactor = 1;
  public specularFactorTexture?: Texture;

  public specularColor = new Color3(1, 1, 1);
  public specularColorTexture?: Texture;

  public specularRoughness = 0;
  public specularRoughnessTexture?: Texture;

  public metallic = 0;
  public metallicTexture?: Texture;

  public normalScale = new Vec2(1, 1);
  public normalTexture?: Texture;

  public emissiveColor = new Color3(0, 0, 0);
  public emissiveTexture?: Texture;
  public emissiveIntensity = 1;

  public ior = 1.5;

  public anisotropy = 0;
  public anisotropyTexture?: Texture;
  public anisotropyDirection = new Vec3(1, 0, 0);
  public anisotropyDirectionTexture?: Texture;

  public clearcoatFactor = 0;
  public clearcoatTexture?: Texture;
  public clearcoatRoughnessFactor = 0;
  public clearcoatRoughnessTexture?: Texture;
  public clearcoatNormalScale = new Vec2(1, 1);
  public clearcoatNormalTexture?: Texture;

  public clearcoatTint = new Color3(1, 1, 1);
  public clearcoatTintTexture?: Texture;

  public sheenColorFactor = new Color3(0, 0, 0);
  public sheenColorTexture?: Texture;
  public sheenRoughnessFactor = 1;
  public sheenRoughnessTexture?: Texture;

  public iridescenceFactor = 0;
  public iridescenceTexture?: Texture;
  public iridescenceIor = 1.5;
  public iridescenceThicknessMinimum = 0;
  public iridescenceThicknessMaximum = 0;
  public iridescenceThicknessTexture?: Texture;

  public transmissionFactor = 0;
  public transmissionTexture?: Texture;

  public attenuationDistance = Number.POSITIVE_INFINITY;
  public attenuationColor = new Color3(1, 1, 1);

  constructor(props: IPhysicalMaterialProps) {
    super({
      id: props.id,
      name: props.name,
      shaderName: 'KhronosPhysicalMaterial'
    });

    this.alpha = props.alpha || this.alpha;
    this.alphaTexture = props.alphaTexture || SolidTextures.White;

    this.albedo.copy(props.albedo || this.albedo);
    this.albedoTexture = props.albedoTexture;

    this.specularFactor = props.specularFactor || this.specularFactor;
    this.specularFactorTexture = props.specularFactorTexture;

    this.specularColor.copy(props.specularColor || this.specularColor);
    this.specularColorTexture = props.specularColorTexture;

    this.specularRoughness = props.specularRoughness || this.specularRoughness;
    this.specularRoughnessTexture = props.specularRoughnessTexture;

    this.metallic = props.metallic || this.metallic;
    this.metallicTexture = props.metallicTexture;

    this.normalScale.copy(props.normalScale || this.normalScale);
    this.normalTexture = props.normalTexture;

    this.emissiveColor.copy(props.emissiveColor || this.emissiveColor);
    this.emissiveTexture = props.emissiveTexture;
    this.emissiveIntensity = props.emissiveIntensity || this.emissiveIntensity;

    this.ior = props.ior || this.ior;

    this.anisotropy = props.anisotropy || this.anisotropy;
    this.anisotropyTexture = props.anisotropyTexture;
    this.anisotropyDirection.copy(
      props.anisotropyDirection || this.anisotropyDirection
    );
    this.anisotropyDirectionTexture = props.anisotropyDirectionTexture;

    this.clearcoatFactor = props.clearcoatFactor || this.clearcoatFactor;
    this.clearcoatTexture = props.clearcoatTexture;
    this.clearcoatRoughnessFactor =
      props.clearcoatRoughnessFactor || this.clearcoatRoughnessFactor;
    this.clearcoatRoughnessTexture = props.clearcoatRoughnessTexture;
    this.clearcoatNormalScale.copy(
      props.clearcoatNormalScale || this.clearcoatNormalScale
    );
    this.clearcoatNormalTexture = props.clearcoatNormalTexture;

    this.clearcoatTint.copy(props.clearcoatTint || this.clearcoatTint);
    this.clearcoatTintTexture = props.clearcoatTintTexture;

    this.sheenColorFactor.copy(props.sheenColorFactor || this.sheenColorFactor);
    this.sheenColorTexture = props.sheenColorTexture;
    this.sheenRoughnessFactor =
      props.sheenRoughnessFactor || this.sheenRoughnessFactor;
    this.sheenRoughnessTexture = props.sheenRoughnessTexture;

    this.iridescenceFactor = props.iridescenceFactor || this.iridescenceFactor;
    this.iridescenceTexture = props.iridescenceTexture;
    this.iridescenceIor = props.iridescenceIor || this.iridescenceIor;
    this.iridescenceThicknessMinimum =
      props.iridescenceThicknessMinimum || this.iridescenceThicknessMinimum;
    this.iridescenceThicknessMaximum =
      props.iridescenceThicknessMaximum || this.iridescenceThicknessMaximum;
    this.iridescenceThicknessTexture = props.iridescenceThicknessTexture;

    this.transmissionFactor =
      props.transmissionFactor || this.transmissionFactor;
    this.transmissionTexture = props.transmissionTexture;

    this.attenuationDistance =
      props.attenuationDistance || this.attenuationDistance;
    this.attenuationColor.copy(props.attenuationColor || this.attenuationColor);
  }

  getParameters(): MaterialParameters {
    return {
      alpha: this.alpha,
      alphaTexture: this.alphaTexture || SolidTextures.White,

      albedo: this.albedo,
      albedoTexture: this.albedoTexture || SolidTextures.White,

      specularFactor: this.specularFactor,
      specularFactorTexture: this.specularFactorTexture || SolidTextures.White,

      specularColor: this.specularColor,
      specularColorTexture: this.specularColorTexture || SolidTextures.White,

      specularRoughness: this.specularRoughness,
      specularRoughnessTexture:
        this.specularRoughnessTexture || SolidTextures.White,

      metallic: this.metallic,
      metallicTexture: this.metallicTexture || SolidTextures.White,

      normalScale: this.normalScale,
      normalTexture: this.normalTexture || SolidTextures.FlatNormal,

      emissiveColor: color3MultiplyByScalar(
        this.emissiveColor,
        this.emissiveIntensity
      ),
      emissiveTexture: this.emissiveTexture || SolidTextures.White,

      ior: this.ior,

      anisotropy: this.anisotropy,
      anisotropyTexture: this.anisotropyTexture || SolidTextures.White,
      anisotropyDirection: this.anisotropyDirection,
      anisotropyDirectionTexture:
        this.anisotropyDirectionTexture || SolidTextures.NeutralDirection,

      clearcoatFactor: this.clearcoatFactor,
      clearcoatTexture: this.clearcoatTexture || SolidTextures.White,
      clearcoatRoughnessFactor: this.clearcoatRoughnessFactor,
      clearcoatRoughnessTexture:
        this.clearcoatRoughnessTexture || SolidTextures.White,
      clearcoatNormalScale: this.clearcoatNormalScale,
      clearcoatNormalTexture:
        this.clearcoatNormalTexture || SolidTextures.FlatNormal,

      clearcoatTint: this.clearcoatTint,
      clearcoatTintTexture: this.clearcoatTintTexture || SolidTextures.White,

      sheenColorFactor: this.sheenColorFactor,
      sheenColorTexture: this.sheenColorTexture || SolidTextures.White,
      sheenRoughnessFactor: this.sheenRoughnessFactor,
      sheenRoughnessTexture: this.sheenRoughnessTexture || SolidTextures.White,

      iridescenceFactor: this.iridescenceFactor,
      iridescenceTexture: this.iridescenceTexture || SolidTextures.White,

      iridescenceIor: this.iridescenceIor,
      iridescenceThicknessMinimum: this.iridescenceThicknessMinimum,
      iridescenceThicknessMaximum: this.iridescenceThicknessMaximum,
      iridescenceThicknessTexture:
        this.iridescenceThicknessTexture || SolidTextures.White,

      transmissionFactor: this.transmissionFactor,
      transmissionTexture: this.transmissionTexture || SolidTextures.White,

      attenuationDistance: this.attenuationDistance,
      attenuationColor: this.attenuationColor
    };
  }
}
