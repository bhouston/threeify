//
// basic shader material
//
// Authors:
// * @bhouston
//

import { generateUUID } from "../core/generateUuid";
import { IDisposable, IIdentifiable, IVersionable } from "../core/types";
import { IPoolUser } from "../renderers/Pool";

export class ShaderMaterial implements IIdentifiable, IVersionable, IDisposable, IPoolUser {
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
