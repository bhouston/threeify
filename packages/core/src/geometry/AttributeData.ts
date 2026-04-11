//
// based on BufferView from glTF
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../core/generateUuid.js';
import { IIdentifiable, IVersionable } from '../core/types.js';
import { BufferTarget } from '../renderers/webgl/buffers/BufferTarget.js';

export class AttributeData implements IIdentifiable, IVersionable {
  public readonly id = generateUUID();
  public version = 0;

  public arrayBuffer: ArrayBuffer;

  constructor(arrayBuffer: ArrayBuffer | ArrayBufferView | ArrayBufferLike, public target: BufferTarget = BufferTarget.Array) {
    this.arrayBuffer = toArrayBuffer(arrayBuffer);
  }

  dirty() {
    this.version++;
  }
}

function toArrayBuffer(value: ArrayBuffer | ArrayBufferView | ArrayBufferLike): ArrayBuffer {
  if (value instanceof ArrayBuffer) {
    return value;
  }

  if (ArrayBuffer.isView(value)) {
    const bytes = new Uint8Array(value.byteLength);
    bytes.set(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
    return bytes.buffer;
  }

  const bytes = new Uint8Array(value.byteLength);
  bytes.set(new Uint8Array(value));
  return bytes.buffer;
}
