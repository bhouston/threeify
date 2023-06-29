import { ResourceCache } from '../../caches/ResourceCache.js';
import { BufferGeometry } from '../buffers/BufferGeometry.js';
import { RenderingContext } from '../RenderingContext.js';

export class BufferGeometryCache extends ResourceCache<BufferGeometry> {
  constructor(public context: RenderingContext) {
    super('BufferGeometry');
  }
}
