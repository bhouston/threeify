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

  constructor(
    public arrayBuffer: ArrayBuffer,
    public byteOffset: number,
    public byteLength: number,
    public byteStride: number,
    // TODO: Can one infer this in the renderer rather than specifying it here?
    public target: BufferTarget = BufferTarget.Array,
  ) {
    if (byteLength > arrayBuffer.byteLength) {
      throw new Error(`byteLength too long: ${byteLength} > ${arrayBuffer.byteLength}`);
    }

    this.byteLength = byteLength < 0 ? arrayBuffer.byteLength : byteLength;
  }

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
