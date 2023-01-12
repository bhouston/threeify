//
// based on BufferView from glTF
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../core/generateUuid.js';
import { IDisposable, IIdentifiable } from '../core/types.js';
import { BufferTarget } from '../renderers/webgl/buffers/BufferTarget.js';

export class AttributeData implements IIdentifiable, IDisposable {
  disposed = false;
  uuid: string = generateUUID();

  constructor(
    public arrayBuffer: ArrayBuffer,
    public target: BufferTarget = BufferTarget.Array
  ) {}

  dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
    }
  }
}
