//
// based on BufferView from glTF
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../core/generateUuid.js';
import { IDisposable, IIdentifiable, IVersionable } from '../core/types.js';
import { IPoolUser } from '../renderers/Pool.js';
import { BufferTarget } from '../renderers/webgl/buffers/BufferTarget.js';

export class AttributeData
  implements IIdentifiable, IVersionable, IDisposable, IPoolUser
{
  disposed = false;
  uuid: string = generateUUID();
  version = 0;

  constructor(
    public arrayBuffer: ArrayBuffer,
    public target: BufferTarget = BufferTarget.Array
  ) {}

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
