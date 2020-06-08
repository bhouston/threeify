//
// based on BufferView from glTF
//
// Authors:
// * @bhouston
//

import { IDisposable, IIdentifiable, IVersionable } from "../model/interfaces";
import { BufferTarget } from "./BufferTarget";
import { IPoolUser } from "../renderers/Pool";
import { generateUUID } from "../model/generateUuid";

export class AttributeView implements IIdentifiable, IVersionable, IDisposable, IPoolUser {
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
