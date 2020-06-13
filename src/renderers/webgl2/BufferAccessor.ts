//
// maps onto void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
//
// Authors:
// * @bhouston
//

import { AttributeAccessor } from "../../geometry/AttributeAccessor";
import { Buffer } from "./Buffer";
import { ComponentType } from "./ComponentType";
import { RenderingContext } from "./RenderingContext";

export class BufferAccessor {
  constructor(
    public buffer: Buffer,
    public componentType: ComponentType,
    public componentsPerVertex: number,
    public normalized: boolean,
    public vertexStride: number,
    public byteOffset: number,
  ) {}

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
