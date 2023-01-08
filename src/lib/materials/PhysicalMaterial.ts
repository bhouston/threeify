//
// basic PBR material
//
// Authors:
// * @bhouston
//

import { Color3 } from '../math/Color3.js';
import { Vector2 } from '../math/Vector2.js';
import { Vector3 } from '../math/Vector3.js';
import { Texture } from '../textures/Texture.js';
import { Blending } from './Blending.js';
import { Material } from './Material.js';
import { OutputChannels } from './OutputChannels.js';

export class PhysicalMaterial extends Material {
  public albedo = new Color3(1, 1, 1);
  public albedoMap: Texture | null = null;

  public specularColorFactor = 1;
  public specularColorTexture: Texture | null = null;

  public specularRoughness = 0;
  public specularRoughnessMap: Texture | null = null;

  public metallic = 0;
  public metallicMap: Texture | null = null;

  public normalScale = new Vector2(1, 1);
  public normalMap: Texture | null = null;

  public emissiveColor = new Color3(0, 0, 0);
  public emissiveMap: Texture | null = null;
  public emissiveIntensity = 1;

  public ior = 1.5;

  public blendMode = Blending.Over;
  public outputs = OutputChannels.Beauty;

  public anisotropy = 0;
  public anisotropyMap: Texture | null = null;
  public anisotropyDirection = new Vector3(1, 0, 0);
  public anisotropyDirectionMap: Texture | null = null;

  public clearcoatFactor = 0;
  public clearcoatTexture: Texture | null = null;
  public clearcoatRoughnessFactor = 0;
  public clearcoatRoughnessTexture: Texture | null = null;
  public clearcoatNormalScale = new Vector2(1, 1);
  public clearcoatNormalTexture: Texture | null = null;

  public clearcoatTint = new Color3(1, 1, 1);
  public clearcoatTintMap: Texture | null = null;

  public sheenColorFactor = new Color3(0, 0, 0);
  public sheenColorTexture: Texture | null = null;
  public sheenRoughnessFactor = new Color3(0, 0, 0);
  public sheenRoughnessTexture: Texture | null = null;

  public iridescenceFactor = 0;
  public iridescenceTexture: Texture | null = null;
  public iridescenceIor = 1.5;
  public iridescenceThicknessMinimum = 0;
  public iridescenceThicknessMaximum = 0;
  public iridescenceThicknessTexture: Texture | null = null;

  public transmissionFactor = 0;
  public transmissionTexture: Texture | null = null;

  public attenuationDistance = Number.POSITIVE_INFINITY;
  public attenuationColor = new Color3(1, 1, 1);
}
