import { Texture } from '../../textures/Texture';
import { ResourceCache } from './ResourceCache';

export class TextureCache extends ResourceCache<Texture> {
  constructor() {
    super('Texture');
  }
}
