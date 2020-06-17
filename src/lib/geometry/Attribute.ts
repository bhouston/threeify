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
  byteLength: number;
  // minExtent: ComponentType;
  // maxExtent: ComponentType;

  constructor(
    public attributeData: AttributeData,
    public byteOffset: number,
    public componentType: ComponentType,
    public componentsPerVertex: number,
    count: number,
  ) {
    const bytesPerComponent = componentTypeSizeOf(this.componentType);
    this.count = count < 0 ? attributeData.byteLength / (bytesPerComponent * this.componentsPerVertex) : count;
    this.byteLength = bytesPerComponent * this.componentsPerVertex * this.count;
    // this.minExtent = minExtent;
    // this.maxExtent = maxExtent;
  }
}

// TODO: Figure out how to replace these below with TypeScript templates
// see here for ideas: https://www.typescriptlang.org/docs/handbook/advanced-types.html

export class Int16Attribute extends Attribute {
  constructor(array: Int16Array | number[], componentsPerVertex = 1) {
    super(
      new AttributeData(array instanceof Int16Array ? array : new Int16Array(array), 0, -1, 2 * componentsPerVertex),
      0,
      ComponentType.Int,
      componentsPerVertex,
      -1,
    );
  }
}

export class Uint32Attribute extends Attribute {
  constructor(array: Uint32Array | number[], componentsPerVertex = 1) {
    super(
      new AttributeData(array instanceof Uint32Array ? array : new Uint32Array(array), 0, -1, 4 * componentsPerVertex),
      0,
      ComponentType.UnsignedInt,
      componentsPerVertex,
      -1,
    );
  }
}
export class Int32Attribute extends Attribute {
  constructor(array: Int32Array | number[], componentsPerVertex = 1) {
    super(
      new AttributeData(array instanceof Int32Array ? array : new Int32Array(array), 0, -1, 4 * componentsPerVertex),
      0,
      ComponentType.Int,
      componentsPerVertex,
      -1,
    );
  }
}

export class Float32Attribute extends Attribute {
  constructor(array: Float32Array | number[], componentsPerVertex = 1) {
    super(
      new AttributeData(
        array instanceof Float32Array ? array : new Float32Array(array),
        0,
        -1,
        4 * componentsPerVertex,
      ),
      0,
      ComponentType.Float,
      componentsPerVertex,
      -1,
    );
  }
}
