//
// renderable mesh geometry, cached via a Vertex Array Object
// roughly based on this design: http://ogldev.atspace.co.uk/www/tutorial32/tutorial32.html
//
// Authors:
// * @bhouston
//

import { IDisposable } from "../../../core/types";
import { Geometry } from "../../../geometry/Geometry";
import { RenderingContext } from "../RenderingContext";
import { BufferAccessor, makeBufferAccessorFromAttribute } from "./BufferAccessor";
import { BufferTarget } from "./BufferTarget";
import { PrimitiveType } from "./PrimitiveType";

export class BufferGeometry implements IDisposable {
  disposed = false;
  bufferAccessors: { [key: string]: BufferAccessor | undefined } = {};
  indices: BufferAccessor | undefined = undefined;
  primitive: PrimitiveType = PrimitiveType.Triangles;
  count = -1;

  constructor(context: RenderingContext, geometry: Geometry) {
    if (geometry.indices !== undefined) {
      this.indices = makeBufferAccessorFromAttribute(context, geometry.indices, BufferTarget.ElementArray);
      this.count = geometry.indices.count;
    }

    for (const name in geometry.attributes) {
      const attribute = geometry.attributes[name];
      if (attribute !== undefined) {
        this.bufferAccessors[name] = makeBufferAccessorFromAttribute(context, attribute);
        if (this.count === -1) {
          this.count = attribute.count;
        }
      }
    }

    this.primitive = geometry.primitive;
  }

  dispose(): void {
    console.warn("This is not safe.  The buffers may be used by multiple bufferViews & bufferGeometries.");
    for (const name in this.bufferAccessors) {
      const bufferAccessor = this.bufferAccessors[name];
      if (bufferAccessor !== undefined) {
        bufferAccessor.buffer.dispose();
      }
    }
  }

  setIndices(indices: BufferAccessor): void {
    this.indices = indices;
  }
}
