import { ResourceCache } from '../../caches/ResourceCache.js';
import { Program } from '../programs/Program.js';
import { RenderingContext } from '../RenderingContext.js';

export class ProgramCache extends ResourceCache<Program> {
  constructor(public context: RenderingContext) {
    super('Program');
  }
}
