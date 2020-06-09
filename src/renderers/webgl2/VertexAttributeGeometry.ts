//
// renderable mesh geometry, cached via a Vertex Array Object
// roughly based on this design: http://ogldev.atspace.co.uk/www/tutorial32/tutorial32.html
//
// Authors:
// * @bhouston
//

import { Geometry } from "../../core/Geometry";
import { PrimitiveType } from "./PrimitiveType";
import { RenderingContext } from "./RenderingContext";
import { VertexAttribute } from "./VertexAttribute";

class NamedVertexAttribute {
  name: string;
  vertexAttribute: VertexAttribute;

  constructor(name: string, vertexAttribute: VertexAttribute) {
    this.name = name;
    this.vertexAttribute = vertexAttribute;
  }
}

export class VertexAttributeGeometry {
  namedVertexAttributes: NamedVertexAttribute[] = [];
  // TODO replace the following array with a map for faster access.
  indices: VertexAttribute | null = null;
  primitive: PrimitiveType = PrimitiveType.Triangles;
  count = -1;

  static FromGeometry(context: RenderingContext, geometry: Geometry): VertexAttributeGeometry {
    const vertexAttributeGeometry = new VertexAttributeGeometry();
    if (geometry.indices) {
      vertexAttributeGeometry.setIndices(VertexAttribute.FromAttributeAccessor(context, geometry.indices));
      vertexAttributeGeometry.count = geometry.indices.count;
    }

    geometry.namedAttributeAccessors.forEach((item) => {
      vertexAttributeGeometry.setAttribute(
        item.name,
        VertexAttribute.FromAttributeAccessor(context, item.attributeAccessor),
      );
      if (vertexAttributeGeometry.count === -1) {
        vertexAttributeGeometry.count = item.attributeAccessor.count;
      }
    });

    vertexAttributeGeometry.primitive = geometry.primitive;

    return vertexAttributeGeometry;
  }

  setIndices(indices: VertexAttribute): void {
    this.indices = indices;
  }

  setAttribute(name: string, vertexAttribute: VertexAttribute): void {
    // TODO this.namedVertexAttributes replace with a map for faster access
    const namedVertexAttribute = this.namedVertexAttributes.find((item) => item.name === name);
    if (namedVertexAttribute) {
      namedVertexAttribute.vertexAttribute = vertexAttribute;
    } else {
      this.namedVertexAttributes.push(new NamedVertexAttribute(name, vertexAttribute));
    }
  }
}
