//
// basic PBR material
//
// Authors:
// * @bhouston
//

import { Vector3 } from '../math/Vector3';
import { TextureAccessor } from '../textures/TextureAccessor';
import { Blending } from './Blending';
import { Material } from './Material';
import { OutputChannels } from './OutputChannels';

export class PhysicalMaterial extends Material {
  version = 0;
  albedo: Vector3 = new Vector3(1, 1, 1);
  albedoMap: TextureAccessor = new TextureAccessor();
  roughness = 0.5;
  roughnessMap: TextureAccessor = new TextureAccessor();
  metalness = 0.0;
  metalnessMap: TextureAccessor = new TextureAccessor();
  emissive: Vector3 = new Vector3(1, 1, 1);
  emissiveMap: TextureAccessor = new TextureAccessor();
  normalFactor = 1.0;
  normalMap: TextureAccessor = new TextureAccessor();
  blendMode = Blending.Over;
  outputs = OutputChannels.Beauty;

  dirty(): void {
    this.version++;
  }
}
