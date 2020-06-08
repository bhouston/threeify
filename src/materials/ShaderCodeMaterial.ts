//
// basic shader material
//
// Authors:
// * @bhouston
//

import { IDisposable, IIdentifiable, IVersionable } from "../types/types";
import { IPoolUser } from "../renderers/Pool";
import { generateUUID } from "../generateUuid";

export class ShaderCodeMaterial implements IIdentifiable, IVersionable, IDisposable, IPoolUser {
  uuid: string = generateUUID();
  version = 0;
  disposed = false;
  name = "";

  constructor(public vertexShaderCode: string, public fragmentShaderCode: string) {}

  dirty(): void {
    this.version++;
  }

  dispose(): void {
    this.disposed = true;
    this.dirty();
  }
}
