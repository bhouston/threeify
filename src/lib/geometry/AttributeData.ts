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

  constructor(
    public arrayBuffer: ArrayBuffer,
    public target: BufferTarget = BufferTarget.Array
  ) {}

  dirty() {
    this.version++;
  }
}
