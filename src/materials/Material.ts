import { ICloneable, ICopyable, IDisposable, IIdentifiable, IVersionable } from "../types/types";
import { generateUUID } from "../generateUuid";

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
