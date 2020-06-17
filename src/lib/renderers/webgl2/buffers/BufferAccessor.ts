//
// maps onto void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
//
// Authors:
// * @bhouston
//

import { Attribute } from "../../../geometry/Attribute";
import { RenderingContext } from "../RenderingContext";
import { Buffer } from "./Buffer";
import { ComponentType } from "./ComponentType";

export class BufferAccessor {
  constructor(
    public buffer: Buffer,
    public componentType: ComponentType,
    public componentsPerVertex: number,
    public normalized: boolean,
    public vertexStride: number,
    public byteOffset: number,
  ) {}

  static FromAttribute(context: RenderingContext, attribute: Attribute): BufferAccessor {
    const attributeData = attribute.attributeData;

    const buffer = new Buffer(context, attributeData.arrayBuffer, attributeData.target);
    const bufferAccessor = new BufferAccessor(
      buffer,
      attribute.componentType,
      attribute.componentsPerVertex,
      false,
      attributeData.byteStride,
      attributeData.byteOffset + attributeData.byteOffset,
    );

    return bufferAccessor;
  }
}
