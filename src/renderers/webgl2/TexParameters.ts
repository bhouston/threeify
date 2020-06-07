import { TextureFilter } from "../../textures/TextureFilter";
import { TextureWrap } from "../../textures/TextureWrap";

export class TexParameters {
  generateMipmaps = true;
  wrapS: TextureWrap = TextureWrap.Repeat;
  wrapT: TextureWrap = TextureWrap.Repeat;
  magFilter: TextureFilter = TextureFilter.Linear;
  minFilter: TextureFilter = TextureFilter.LinearMipmapLinear;
  anisotropicLevels = 1;
}
