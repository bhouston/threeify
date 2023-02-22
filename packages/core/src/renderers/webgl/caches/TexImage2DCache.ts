import { ResourceCache } from '../../caches/ResourceCache';
import { RenderingContext } from '../RenderingContext';
import { TexImage2D } from '../textures/TexImage2D';

export class TexImage2DCache extends ResourceCache<TexImage2D> {
  constructor(public context: RenderingContext) {
    super('TexImage2D');
  }
}
