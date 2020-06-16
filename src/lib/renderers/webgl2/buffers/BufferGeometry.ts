//
// renderable mesh geometry, cached via a Vertex Array Object
// roughly based on this design: http://ogldev.atspace.co.uk/www/tutorial32/tutorial32.html
//
// Authors:
// * @bhouston
//

import { Dictionary } from "../../../core/Dictionary";
import { Geometry } from "../../../geometry/Geometry";
import { RenderingContext } from "../RenderingContext";
import { BufferAccessor } from "./BufferAccessor";
import { PrimitiveType } from "./PrimitiveType";

export class BufferGeometry {
  bufferAccessors = new Dictionary<string, BufferAccessor>();
  indices: BufferAccessor | undefined = undefined;
  primitive: PrimitiveType = PrimitiveType.Triangles;
  count = -1;

  static FromAttributeGeometry(context: RenderingContext, geometry: Geometry): BufferGeometry {
    const bufferGeometry = new BufferGeometry();
    if (geometry.indices !== undefined) {
      bufferGeometry.setIndices(BufferAccessor.FromAttributeAccessor(context, geometry.indices));
      bufferGeometry.count = geometry.indices.count;
    }

    geometry.attributeAccessors.forEach((attributeAccessor, name) => {
      bufferGeometry.bufferAccessors.set(name, BufferAccessor.FromAttributeAccessor(context, attributeAccessor));
      if (bufferGeometry.count === -1) {
        bufferGeometry.count = attributeAccessor.count;
      }
    });

    bufferGeometry.primitive = geometry.primitive;

    return bufferGeometry;
  }

  setIndices(indices: BufferAccessor): void {
    this.indices = indices;
  }
}
