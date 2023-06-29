import { Texture } from '../../textures/Texture.js';
import { ResourceCache } from './ResourceCache.js';

export class TextureCache extends ResourceCache<Texture> {
  constructor() {
    super('Texture');
  }
}
