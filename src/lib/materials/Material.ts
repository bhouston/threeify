import { generateUUID } from "../core/generateUuid";
import { IDisposable, IIdentifiable, IVersionable } from "../core/types";

export class Material implements IIdentifiable, IVersionable, IDisposable {
  disposed = false;
  readonly uuid: string = generateUUID();
  version = 0;
  name = "";

  dirty(): void {
    this.version++;
  }

  dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
      this.dirty();
    }
  }
}
