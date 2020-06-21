//
// based on Accessor from glTF
//
// Authors:
// * @bhouston
//

import { ComponentType, componentTypeSizeOf } from "../renderers/webgl2/buffers/ComponentType";
import { AttributeData } from "./AttributeData";

export class Attribute {
  count: number;
  bytesPerVertex: number;

  constructor(
    public attributeData: AttributeData,
    public componentsPerVertex: number,
    public componentType: ComponentType,
    public vertexStride: number,
    public byteOffset: number,
  ) {
    const bytesPerComponent = componentTypeSizeOf(this.componentType);
    this.bytesPerVertex = bytesPerComponent * this.componentsPerVertex;
    if (this.vertexStride < 0) {
      this.vertexStride = this.bytesPerVertex;
    }
    this.count = this.attributeData.arrayBuffer.byteLength / this.vertexStride;
    // this.minExtent = minExtent;
    // this.maxExtent = maxExtent;
  }
}

// TODO: Figure out how to replace these below with TypeScript templates
// see here for ideas: https://www.typescriptlang.org/docs/handbook/advanced-types.html

export class Uint8Attribute extends Attribute {
  constructor(array: Uint8Array | number[], componentsPerVertex = 1) {
    super(
      new AttributeData(array instanceof Uint8Array ? array : new Uint8Array(array)),
      componentsPerVertex,
      ComponentType.UnsignedByte,
      -1,
      0,
    );
  }
}
export class Int16Attribute extends Attribute {
  constructor(array: Int16Array | number[], componentsPerVertex = 1) {
    super(
      new AttributeData(array instanceof Int16Array ? array : new Int16Array(array)),
      componentsPerVertex,
      ComponentType.UnsignedShort,
      -1,
      0,
    );
  }
}

export class Uint32Attribute extends Attribute {
  constructor(array: Uint32Array | number[], componentsPerVertex = 1) {
    super(
      new AttributeData(array instanceof Uint32Array ? array : new Uint32Array(array)),
      componentsPerVertex,
      ComponentType.UnsignedInt,
      -1,
      0,
    );
  }
}
export class Int32Attribute extends Attribute {
  constructor(array: Int32Array | number[], componentsPerVertex = 1) {
    super(
      new AttributeData(array instanceof Int32Array ? array : new Int32Array(array)),
      componentsPerVertex,
      ComponentType.Int,
      -1,
      0,
    );
  }
}

export class Float32Attribute extends Attribute {
  constructor(array: Float32Array | number[], componentsPerVertex = 1) {
    super(
      new AttributeData(array instanceof Float32Array ? array : new Float32Array(array)),
      componentsPerVertex,
      ComponentType.Float,
      -1,
      0,
    );
  }
}
