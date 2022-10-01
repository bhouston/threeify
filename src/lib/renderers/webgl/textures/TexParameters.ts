import { TextureFilter } from './TextureFilter';
import { TextureWrap } from './TextureWrap';

export class TexParameters {
  generateMipmaps = true;
  wrapS: TextureWrap = TextureWrap.Repeat;
  wrapT: TextureWrap = TextureWrap.Repeat;
  magFilter: TextureFilter = TextureFilter.Linear;
  minFilter: TextureFilter = TextureFilter.LinearMipmapLinear;
  anisotropyLevels = 2;
}
