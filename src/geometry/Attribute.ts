//
// based on BufferView from glTF
//
// Authors:
// * @bhouston
//

import { generateUUID } from "../core/generateUuid";
import { IDisposable, IIdentifiable, IVersionable } from "../core/types";
import { IPoolUser } from "../renderers/Pool";
import { BufferTarget } from "../renderers/webgl2/BufferTarget";

export class Attribute implements IIdentifiable, IVersionable, IDisposable, IPoolUser {
  disposed = false;
  uuid: string = generateUUID();
  version = 0;
  arrayBuffer: ArrayBuffer;
  byteOffset: number;
  byteLength: number;
  byteStride: number;
  target: BufferTarget; // TODO: Can one infer this in the renderer rather than specifying it here?

  constructor(
    arrayBuffer: ArrayBuffer,
    byteOffset: number,
    byteLength: number,
    byteStride: number,
    target: BufferTarget = BufferTarget.Array,
  ) {
    if (byteLength > arrayBuffer.byteLength) {
      throw new Error(`byteLength too long: ${byteLength} > ${arrayBuffer.byteLength}`);
    }

    this.arrayBuffer = arrayBuffer;
    this.byteOffset = byteOffset;
    this.byteLength = byteLength < 0 ? arrayBuffer.byteLength : byteLength;
    this.byteStride = byteStride;
    this.target = target;
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
