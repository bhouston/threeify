import { ResourceCache } from '../../caches/ResourceCache';
import { Program } from '../programs/Program';
import { RenderingContext } from '../RenderingContext';

export class ProgramCache extends ResourceCache<Program> {
  constructor(public context: RenderingContext) {
    super('Program');
  }
}
