//
// maps onto void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
//
// Authors:
// * @bhouston
//

import { AttributeAccessor } from "../../../geometry/AttributeAccessor";
import { RenderingContext } from "../RenderingContext";
import { Buffer } from "./Buffer";
import { ComponentType } from "./ComponentType";

export class BufferAccessor {
  buffer: Buffer;
  componentType: ComponentType;
  componentsPerVertex: number;
  normalized: boolean;
  vertexStride: number;
  byteOffset: number;

  constructor(
    buffer: Buffer,
    componentType: ComponentType,
    componentsPerVertex: number,
    normalized: boolean,
    vertexStride: number,
    byteOffset: number,
  ) {
    this.buffer = buffer;
    this.byteOffset = byteOffset;
    this.componentType = componentType;
    this.componentsPerVertex = componentsPerVertex;
    this.normalized = normalized;
    this.vertexStride = vertexStride;
    this.byteOffset = byteOffset;
  }

  static FromAttributeAccessor(context: RenderingContext, attributeAccessor: AttributeAccessor): BufferAccessor {
    const attribute = attributeAccessor.attributeView;

    const buffer = new Buffer(context, attribute.arrayBuffer, attribute.target);
    const bufferAccessor = new BufferAccessor(
      buffer,
      attributeAccessor.componentType,
      attributeAccessor.componentsPerVertex,
      false,
      attribute.byteStride,
      attribute.byteOffset + attributeAccessor.byteOffset,
    );

    return bufferAccessor;
  }
}
