//
// renderable mesh geometry, cached via a Vertex Array Object
// roughly based on this design: http://ogldev.atspace.co.uk/www/tutorial32/tutorial32.html
//
// Authors:
// * @bhouston
//

import { IDisposable } from "lib/core/types";
import { Dictionary } from "../../../core/Dictionary";
import { Geometry } from "../../../geometry/Geometry";
import { RenderingContext } from "../RenderingContext";
import { BufferAccessor } from "./BufferAccessor";
import { PrimitiveType } from "./PrimitiveType";

export class BufferGeometry implements IDisposable {
  disposed = false;
  bufferAccessors = new Dictionary<string, BufferAccessor>();
  indices: BufferAccessor | undefined = undefined;
  primitive: PrimitiveType = PrimitiveType.Triangles;
  count = -1;

  constructor(context: RenderingContext, geometry: Geometry) {
    if (geometry.indices !== undefined) {
      this.setIndices(BufferAccessor.FromAttribute(context, geometry.indices));
      this.count = geometry.indices.count;
    }

    geometry.attributes.forEach((attribute, name) => {
      this.bufferAccessors.set(name, BufferAccessor.FromAttribute(context, attribute));
      if (this.count === -1) {
        this.count = attribute.count;
      }
    });

    this.primitive = geometry.primitive;
  }

  dispose(): void {
    console.warn("This is not safe.  The buffers may be used by multiple bufferViews & bufferGeometries.");
    this.bufferAccessors.forEach((bufferAccessor) => {
      bufferAccessor.buffer.dispose();
    });
  }

  setIndices(indices: BufferAccessor): void {
    this.indices = indices;
  }
}
