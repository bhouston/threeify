import { TextureFilter } from './TextureFilter';
import { TextureWrap } from './TextureWrap';

export class TexParameters {
  constructor(
    public magFilter = TextureFilter.Linear,
    public minFilter = TextureFilter.LinearMipmapLinear,
    public wrapS = TextureWrap.Repeat,
    public wrapT = TextureWrap.Repeat,
    public generateMipmaps = true,
    public anisotropyLevels = 2
  ) {}
}
