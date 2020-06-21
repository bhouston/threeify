//
// based on Accessor from glTF
//
// Authors:
// * @bhouston
//

import { generateUUID } from "../core/generateUuid";
import { IIdentifiable } from "../core/types";
import { ComponentType, componentTypeSizeOf } from "../renderers/webgl2/buffers/ComponentType";
import { AttributeData } from "./AttributeData";

export class Attribute implements IIdentifiable {
  uuid: string = generateUUID();
  count: number;
  bytesPerVertex: number;
  bytesPerComponent: number;

  constructor(
    public attributeData: AttributeData,
    public componentsPerVertex: number,
    public componentType: ComponentType,
    public vertexStride: number,
    public byteOffset: number,
    public normalized: boolean,
  ) {
    this.bytesPerComponent = componentTypeSizeOf(this.componentType);
    this.bytesPerVertex = this.bytesPerComponent * this.componentsPerVertex;
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
  constructor(array: Uint8Array | number[], componentsPerVertex = 1, normalized = false) {
    super(
      new AttributeData((array instanceof Uint8Array ? array : new Uint8Array(array)).buffer),
      componentsPerVertex,
      ComponentType.UnsignedByte,
      -1,
      0,
      normalized,
    );
  }
}
export class Int16Attribute extends Attribute {
  constructor(array: Int16Array | number[], componentsPerVertex = 1, normalized = false) {
    super(
      new AttributeData((array instanceof Int16Array ? array : new Int16Array(array)).buffer),
      componentsPerVertex,
      ComponentType.UnsignedShort,
      -1,
      0,
      normalized,
    );
  }
}

export class Uint32Attribute extends Attribute {
  constructor(array: Uint32Array | number[], componentsPerVertex = 1, normalized = false) {
    super(
      new AttributeData((array instanceof Uint32Array ? array : new Uint32Array(array)).buffer),
      componentsPerVertex,
      ComponentType.UnsignedInt,
      -1,
      0,
      normalized,
    );
  }
}
export class Int32Attribute extends Attribute {
  constructor(array: Int32Array | number[], componentsPerVertex = 1, normalized = false) {
    super(
      new AttributeData((array instanceof Int32Array ? array : new Int32Array(array)).buffer),
      componentsPerVertex,
      ComponentType.Int,
      -1,
      0,
      normalized,
    );
  }
}

export class Float32Attribute extends Attribute {
  constructor(array: Float32Array | number[], componentsPerVertex = 1, normalized = false) {
    super(
      new AttributeData((array instanceof Float32Array ? array : new Float32Array(array)).buffer),
      componentsPerVertex,
      ComponentType.Float,
      -1,
      0,
      normalized,
    );
  }
}
