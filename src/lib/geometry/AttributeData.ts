//
// based on BufferView from glTF
//
// Authors:
// * @bhouston
//

import { generateUUID } from "../core/generateUuid";
import { IDisposable, IIdentifiable, IVersionable } from "../core/types";
import { IPoolUser } from "../renderers/Pool";
import { BufferTarget } from "../renderers/webgl2/buffers/BufferTarget";

export class AttributeData implements IIdentifiable, IVersionable, IDisposable, IPoolUser {
  disposed = false;
  uuid: string = generateUUID();
  version = 0;

  constructor(public arrayBuffer: ArrayBuffer, public target: BufferTarget = BufferTarget.Array) {}

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
