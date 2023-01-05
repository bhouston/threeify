//
// basic PBR material
//
// Authors:
// * @bhouston
//

import { Vector3 } from '../math/Vector3.js';
import { TextureAccessor } from '../textures/TextureAccessor.js';
import { Blending } from './Blending.js';
import { Material } from './Material.js';
import { OutputChannels } from './OutputChannels.js';

export class PhysicalMaterial extends Material {
  version = 0;
  albedo: Vector3 = new Vector3(1, 1, 1);
  albedoMap: TextureAccessor = new TextureAccessor();
  roughness = 0.5;
  roughnessMap: TextureAccessor = new TextureAccessor();
  metalness = 0;
  metalnessMap: TextureAccessor = new TextureAccessor();
  emissive: Vector3 = new Vector3(1, 1, 1);
  emissiveMap: TextureAccessor = new TextureAccessor();
  normalFactor = 1;
  normalMap: TextureAccessor = new TextureAccessor();
  blendMode = Blending.Over;
  outputs = OutputChannels.Beauty;

  dirty(): void {
    this.version++;
  }
}
