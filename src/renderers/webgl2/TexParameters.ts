import { TextureWrap } from "../../textures/TextureWrap.js";
import { TextureFilter } from "../../textures/TextureFilter.js";

export class TexParameters {
  generateMipmaps: boolean = true;
  wrapS: TextureWrap = TextureWrap.Repeat;
  wrapT: TextureWrap = TextureWrap.Repeat;
  magFilter: TextureFilter = TextureFilter.Linear;
  minFilter: TextureFilter = TextureFilter.LinearMipmapLinear;
  anisotropicLevels: number = 1;
}
