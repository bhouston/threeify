//
// basic PBR material
//
// Authors:
// * @bhouston
//

import { Color } from "../math/Color";
import { TextureAccessor } from "../textures/TextureAccessor";
import { Blending } from "./Blending";
import { Material } from "./Material";
import { MaterialOutputs } from "./MaterialOutputs";

export class PhysicalMaterial extends Material {
  version = 0;
  albedo: Color = new Color(1, 1, 1);
  albedoMap: TextureAccessor = new TextureAccessor();
  roughness = 0.5;
  roughnessMap: TextureAccessor = new TextureAccessor();
  metalness = 0.0;
  metalnessMap: TextureAccessor = new TextureAccessor();
  emissive: Color = new Color(1, 1, 1);
  emissiveMap: TextureAccessor = new TextureAccessor();
  normalFactor = 1.0;
  normalMap: TextureAccessor = new TextureAccessor();
  blendMode = Blending.Over;
  outputs = MaterialOutputs.Beauty;

  dirty(): void {
    this.version++;
  }
}
