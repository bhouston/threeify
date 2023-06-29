import { ResourceCache } from '../../caches/ResourceCache.js';
import { RenderingContext } from '../RenderingContext.js';
import { TexImage2D } from '../textures/TexImage2D.js';

export class TexImage2DCache extends ResourceCache<TexImage2D> {
  constructor(public context: RenderingContext) {
    super('TexImage2D');
  }
}
