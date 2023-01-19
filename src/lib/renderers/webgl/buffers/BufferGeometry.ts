//
// renderable mesh geometry, cached via a Vertex Array Object
// roughly based on this design: http://ogldev.atspace.co.uk/www/tutorial32/tutorial32.html
//
// Authors:
// * @bhouston
//

import { IDisposable } from '../../../core/types.js';
import { Geometry } from '../../../geometry/Geometry.js';
import { warnOnce } from '../../../warnOnce.js';
import { RenderingContext } from '../RenderingContext.js';
import {
  BufferAccessor,
  makeBufferAccessorFromAttribute
} from './BufferAccessor.js';
import { BufferTarget } from './BufferTarget.js';
import { PrimitiveType } from './PrimitiveType.js';

export class BufferGeometry implements IDisposable {
  public version = 0;
  public disposed = false;
  public bufferAccessors: { [key: string]: BufferAccessor | undefined } = {};
  public indices: BufferAccessor | undefined = undefined;
  public primitive: PrimitiveType = PrimitiveType.Triangles;
  public count = -1;

  constructor(public context: RenderingContext) {}

  dispose(): void {
    warnOnce(
      'This is not safe.  The buffers may be used by multiple bufferViews & bufferGeometries.'
    );
    if (this.disposed) return;

    for (const name in this.bufferAccessors) {
      const bufferAccessor = this.bufferAccessors[name];
      if (bufferAccessor !== undefined) {
        bufferAccessor.buffer.dispose();
      }
    }
    if (this.indices !== undefined) {
      this.indices.buffer.dispose();
    }
    this.disposed = true;
  }
}

export function makeBufferGeometryFromGeometry(
  context: RenderingContext,
  geometry: Geometry
): BufferGeometry {
  const bufferGeometry = new BufferGeometry(context);
  if (geometry.indices !== undefined) {
    bufferGeometry.indices = makeBufferAccessorFromAttribute(
      context,
      geometry.indices,
      BufferTarget.ElementArray
    );
    bufferGeometry.count = geometry.indices.count;
  }

  for (const name in geometry.attributes) {
    const attribute = geometry.attributes[name];
    if (attribute !== undefined) {
      bufferGeometry.bufferAccessors[name] = makeBufferAccessorFromAttribute(
        context,
        attribute
      );
      if (bufferGeometry.count === -1) {
        bufferGeometry.count = attribute.count;
      }
    }
  }

  bufferGeometry.primitive = geometry.primitive;

  return bufferGeometry;
}
