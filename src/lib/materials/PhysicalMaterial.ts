//
// basic PBR material
//
// Authors:
// * @bhouston
//

import { Color3 } from '../math/Color3.js';
import { Vec2 } from '../math/Vec2.js';
import { Vec3 } from '../math/Vec3.js';
import { Texture } from '../textures/Texture.js';
import { Blending } from './Blending.js';
import { IMaterial } from './IMaterial.js';
import { OutputChannels } from './OutputChannels.js';

export class PhysicalMaterial implements IMaterial {
  public materialName = 'PhysicalMaterial';

  public albedo = new Color3(1, 1, 1);
  public albedoMap?: Texture;

  public specularColorFactor = 1;
  public specularColorTexture?: Texture;

  public specularRoughness = 0;
  public specularRoughnessMap?: Texture;

  public metallic = 0;
  public metallicMap?: Texture;

  public normalScale = new Vec2(1, 1);
  public normalMap?: Texture;

  public emissiveColor = new Color3(0, 0, 0);
  public emissiveMap?: Texture;
  public emissiveIntensity = 1;

  public ior = 1.5;

  public blendMode = Blending.Over;
  public outputs = OutputChannels.Beauty;

  public anisotropy = 0;
  public anisotropyMap?: Texture;
  public anisotropyDirection = new Vec3(1, 0, 0);
  public anisotropyDirectionMap?: Texture;

  public clearcoatFactor = 0;
  public clearcoatTexture?: Texture;
  public clearcoatRoughnessFactor = 0;
  public clearcoatRoughnessTexture?: Texture;
  public clearcoatNormalScale = new Vec2(1, 1);
  public clearcoatNormalTexture?: Texture;

  public clearcoatTint = new Color3(1, 1, 1);
  public clearcoatTintMap?: Texture;

  public sheenColorFactor = new Color3(0, 0, 0);
  public sheenColorTexture?: Texture;
  public sheenRoughnessFactor = new Color3(0, 0, 0);
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
}
