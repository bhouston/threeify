import { generateUUID } from '../core/generateUuid.js';
import { IDisposable, IIdentifiable } from '../core/types.js';

export class Material implements IIdentifiable, IDisposable {
  disposed = false;
  readonly uuid: string = generateUUID();
  name = '';

  dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
    }
  }
}
