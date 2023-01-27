import { Color3 } from '../math/Color3';
import { color3MultiplyByScalar } from '../math/Color3.Functions';
import { Mat3 } from '../math/Mat3';
import { Vec2 } from '../math/Vec2';
import { Vec3 } from '../math/Vec3';
import { SolidTextures } from '../textures/loaders/SolidTextures';
import { Texture } from '../textures/Texture';
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
  alphaTexture?: Texture;
  alphaUVTransform?: Mat3;
  alphaMode?: AlphaMode;
  alphaCutoff?: number;

  albedoFactor?: Color3;
  albedoTexture?: Texture;
  albedoUVTransform?: Mat3;

  specularFactor?: number;
  specularFactorTexture?: Texture;

  specularColor?: Color3;
  specularColorTexture?: Texture;

  specularRoughnessFactor?: number;
  specularRoughnessTexture?: Texture;
  specularRoughnessUVTransform?: Mat3;

  metallicFactor?: number;
  metallicTexture?: Texture;
  metallicUVTransform?: Mat3;

  normalScale?: Vec2;
  normalTexture?: Texture;
  normalUVTransform?: Mat3;

  occlusionFactor?: number;
  occlusionTexture?: Texture;
  occlusionUVTransform?: Mat3;

  emissiveFactor?: Color3;
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
  public alphaUVTransform = new Mat3();
  public alphaMode = AlphaMode.Opaque;
  public alphaCutoff = 0.5;

  public albedoFactor = new Color3(1, 1, 1);
  public albedoTexture?: Texture;
  public albedoUVTransform = new Mat3();

  public specularFactor = 0.5;
  public specularFactorTexture?: Texture;

  public specularColor = new Color3(1, 1, 1);
  public specularColorTexture?: Texture;

  public specularRoughnessFactor = 0.5;
  public specularRoughnessTexture?: Texture;
  public specularRoughnessUVTransform = new Mat3();

  public metallicFactor = 1;
  public metallicTexture?: Texture;
  public metallicUVTransform = new Mat3();

  public normalScale = new Vec2(1, 1);
  public normalTexture?: Texture;
  public normalUVTransform = new Mat3();

  public occlusionFactor = 1;
  public occlusionTexture?: Texture;
  public occlusionUVTransform = new Mat3();

  public emissiveFactor = new Color3(0, 0, 0);
  public emissiveTexture?: Texture;
  public emissiveIntensity = 1;

  public ior = 1.5;

  public anisotropy = 0;
  public anisotropyTexture?: Texture;
  public anisotropyDirection = new Vec3(0, 0, 1);
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

    if (props.alpha !== undefined) this.alpha = props.alpha;
    this.alphaTexture = props.alphaTexture || SolidTextures.White;
    this.alphaUVTransform.copy(props.alphaUVTransform || this.alphaUVTransform);
    if (props.alphaMode !== undefined) this.alphaMode = props.alphaMode;
    if (props.alphaCutoff !== undefined) this.alphaCutoff = props.alphaCutoff;

    this.albedoFactor.copy(props.albedoFactor || this.albedoFactor);
    this.albedoTexture = props.albedoTexture;
    this.albedoUVTransform.copy(
      props.albedoUVTransform || this.albedoUVTransform
    );

    if (props.specularFactor !== undefined)
      this.specularFactor = props.specularFactor;
    this.specularFactorTexture = props.specularFactorTexture;

    this.specularColor.copy(props.specularColor || this.specularColor);
    this.specularColorTexture = props.specularColorTexture;

    if (props.specularRoughnessFactor !== undefined)
      this.specularRoughnessFactor = props.specularRoughnessFactor;
    this.specularRoughnessTexture = props.specularRoughnessTexture;
    this.specularRoughnessUVTransform.copy(
      props.specularRoughnessUVTransform || this.specularRoughnessUVTransform
    );

    if (props.metallicFactor !== undefined)
      this.metallicFactor = props.metallicFactor;
    this.metallicTexture = props.metallicTexture;
    this.metallicUVTransform.copy(
      props.metallicUVTransform || this.metallicUVTransform
    );

    this.normalScale.copy(props.normalScale || this.normalScale);
    this.normalTexture = props.normalTexture;
    this.normalUVTransform.copy(
      props.normalUVTransform || this.normalUVTransform
    );

    if (props.occlusionFactor !== undefined)
      this.occlusionFactor = props.occlusionFactor;
    this.occlusionTexture = props.occlusionTexture;
    this.occlusionUVTransform.copy(
      props.occlusionUVTransform || this.occlusionUVTransform
    );

    this.emissiveFactor.copy(props.emissiveFactor || this.emissiveFactor);
    this.emissiveTexture = props.emissiveTexture;
    if (props.emissiveIntensity !== undefined)
      this.emissiveIntensity = props.emissiveIntensity;

    if (props.ior !== undefined) this.ior = props.ior;

    if (props.anisotropy !== undefined) this.anisotropy = props.anisotropy;
    this.anisotropyTexture = props.anisotropyTexture;
    this.anisotropyDirection.copy(
      props.anisotropyDirection || this.anisotropyDirection
    );
    this.anisotropyDirectionTexture = props.anisotropyDirectionTexture;

    if (props.clearcoatFactor !== undefined)
      this.clearcoatFactor = props.clearcoatFactor;
    this.clearcoatTexture = props.clearcoatTexture;
    if (props.clearcoatRoughnessFactor !== undefined)
      this.clearcoatRoughnessFactor = props.clearcoatRoughnessFactor;
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

    if (props.iridescenceFactor !== undefined)
      this.iridescenceFactor = props.iridescenceFactor;
    this.iridescenceTexture = props.iridescenceTexture;
    if (props.iridescenceIor !== undefined)
      this.iridescenceIor = props.iridescenceIor;
    if (props.iridescenceThicknessMinimum !== undefined)
      this.iridescenceThicknessMinimum = props.iridescenceThicknessMinimum;
    if (props.iridescenceThicknessMaximum !== undefined)
      this.iridescenceThicknessMaximum = props.iridescenceThicknessMaximum;
    this.iridescenceThicknessTexture = props.iridescenceThicknessTexture;

    if (props.transmissionFactor !== undefined)
      this.transmissionFactor = props.transmissionFactor;
    this.transmissionTexture = props.transmissionTexture;

    if (props.attenuationDistance !== undefined)
      this.attenuationDistance = props.attenuationDistance;
    this.attenuationColor.copy(props.attenuationColor || this.attenuationColor);
  }

  getParameters(): MaterialParameters {
    return {
      alpha: this.alpha,
      alphaTexture: this.alphaTexture || SolidTextures.White,
      alphaUVTransform: this.alphaUVTransform,
      alphaMode: this.alphaMode,
      alphaCutoff: this.alphaCutoff,

      albedoFactor: this.albedoFactor,
      albedoTexture: this.albedoTexture || SolidTextures.White,
      albedoUVTransform: this.albedoUVTransform,

      specularFactor: this.specularFactor,
      specularFactorTexture: this.specularFactorTexture || SolidTextures.White,

      specularColor: this.specularColor,
      specularColorTexture: this.specularColorTexture || SolidTextures.White,

      specularRoughnessFactor: this.specularRoughnessFactor,
      specularRoughnessTexture:
        this.specularRoughnessTexture || SolidTextures.White,
      specularRoughnessUVTransform: this.specularRoughnessUVTransform,

      metallicFactor: this.metallicFactor,
      metallicTexture: this.metallicTexture || SolidTextures.White,
      metallicUVTransform: this.metallicUVTransform,

      normalScale: this.normalScale,
      normalTexture: this.normalTexture || SolidTextures.FlatNormal,
      normalUVTransform: this.normalUVTransform,

      occlusionFactor: this.occlusionFactor,
      occlusionTexture: this.occlusionTexture || SolidTextures.White,
      occlusionUVTransform: this.occlusionUVTransform,

      emissiveFactor: color3MultiplyByScalar(
        this.emissiveFactor,
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
