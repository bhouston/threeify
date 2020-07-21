import { generateUUID } from "../core/generateUuid";
import { IDisposable } from "../core/types";

export class Controller implements IDisposable {
  disposed = false;
  enabled = true;
  name = "";
  readonly uuid: string = generateUUID();

  constructor() {}

  dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
    }
  }
}
