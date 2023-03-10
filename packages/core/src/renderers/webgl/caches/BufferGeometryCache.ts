import { ResourceCache } from '../../caches/ResourceCache';
import { BufferGeometry } from '../buffers/BufferGeometry';
import { Program } from '../programs/Program';
import { RenderingContext } from '../RenderingContext';

export class BufferGeometryCache extends ResourceCache<BufferGeometry> {
  constructor(public context: RenderingContext) {
    super('BufferGeometry');
  }
}
