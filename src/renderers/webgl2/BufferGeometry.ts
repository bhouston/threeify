//
// renderable mesh geometry, cached via a Vertex Array Object
// roughly based on this design: http://ogldev.atspace.co.uk/www/tutorial32/tutorial32.html
//
// Authors:
// * @bhouston
//

import { Geometry } from "../../geometry/Geometry";
import { RenderingContext } from "./RenderingContext";
import { BufferAccessor } from "./BufferAccessor";
import { PrimitiveType } from "./PrimitiveType";

class NamedVertexAttribute {
  name: string;
  vertexAttribute: BufferAccessor;

  constructor(name: string, vertexAttribute: BufferAccessor) {
    this.name = name;
    this.vertexAttribute = vertexAttribute;
  }
}

export class BufferGeometry {
  namedVertexAttributes: NamedVertexAttribute[] = [];
  // TODO replace the following array with a map for faster access.
  indices: BufferAccessor | null = null;
  primitive: PrimitiveType = PrimitiveType.Triangles;
  count = -1;

  static FromGeometry(context: RenderingContext, geometry: Geometry): BufferGeometry {
    const vertexAttributeGeometry = new BufferGeometry();
    if (geometry.indices) {
      vertexAttributeGeometry.setIndices(BufferAccessor.FromAttributeAccessor(context, geometry.indices));
      vertexAttributeGeometry.count = geometry.indices.count;
    }

    geometry.namedAttributeAccessors.forEach((item) => {
      vertexAttributeGeometry.setAttribute(
        item.name,
        BufferAccessor.FromAttributeAccessor(context, item.attributeAccessor),
      );
      if (vertexAttributeGeometry.count === -1) {
        vertexAttributeGeometry.count = item.attributeAccessor.count;
      }
    });

    vertexAttributeGeometry.primitive = geometry.primitive;

    return vertexAttributeGeometry;
  }

  setIndices(indices: BufferAccessor): void {
    this.indices = indices;
  }

  setAttribute(name: string, vertexAttribute: BufferAccessor): void {
    // TODO this.namedVertexAttributes replace with a map for faster access
    const namedVertexAttribute = this.namedVertexAttributes.find((item) => item.name === name);
    if (namedVertexAttribute) {
      namedVertexAttribute.vertexAttribute = vertexAttribute;
    } else {
      this.namedVertexAttributes.push(new NamedVertexAttribute(name, vertexAttribute));
    }
  }
}
