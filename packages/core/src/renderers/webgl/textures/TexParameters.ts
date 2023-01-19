import { TextureFilter } from './TextureFilter.js';
import { TextureWrap } from './TextureWrap.js';

export class TexParameters {
  generateMipmaps = true;
  wrapS: TextureWrap = TextureWrap.Repeat;
  wrapT: TextureWrap = TextureWrap.Repeat;
  magFilter: TextureFilter = TextureFilter.Linear;
  minFilter: TextureFilter = TextureFilter.LinearMipmapLinear;
  anisotropyLevels = 2;
}
