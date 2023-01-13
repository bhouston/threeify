//
// based on BufferView from glTF
//
// Authors:
// * @bhouston
//

import { BufferTarget } from '../renderers/webgl/buffers/BufferTarget.js';

export class AttributeData {
  constructor(
    public arrayBuffer: ArrayBuffer,
    public target: BufferTarget = BufferTarget.Array
  ) {}
}
