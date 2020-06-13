//
// based on Accessor from glTF
//
// Authors:
// * @bhouston
//

import { ComponentType, componentTypeSizeOf } from "../renderers/webgl2/ComponentType";
import { Attribute } from "./Attribute";

export class AttributeAccessor {
  count: number;
  byteLength: number;
  // minExtent: ComponentType;
  // maxExtent: ComponentType;

  constructor(
    public attributeView: Attribute,
    public byteOffset: number,
    public componentType: ComponentType,
    public componentsPerVertex: number,
    count: number,
  ) {
    const bytesPerComponent = componentTypeSizeOf(this.componentType);
    this.count = count < 0 ? attributeView.byteLength / bytesPerComponent : count;
    this.byteLength = bytesPerComponent * this.componentsPerVertex * this.count;
    // this.minExtent = minExtent;
    // this.maxExtent = maxExtent;
  }
}

// TODO: Figure out how to replace these below with TypeScript templates
// see here for ideas: https://www.typescriptlang.org/docs/handbook/advanced-types.html

export class Int16AttributeAccessor extends AttributeAccessor {
  constructor(intArray: Int16Array, componentsPerVertex: number) {
    super(new Attribute(intArray, 0, -1, 2 * componentsPerVertex), 0, ComponentType.Int, componentsPerVertex, -1);
  }
}

export class Int32AttributeAccessor extends AttributeAccessor {
  constructor(intArray: Int32Array, componentsPerVertex: number) {
    super(new Attribute(intArray, 0, -1, 4 * componentsPerVertex), 0, ComponentType.Int, componentsPerVertex, -1);
  }
}

export class Float32AttributeAccessor extends AttributeAccessor {
  constructor(vec2Array: Float32Array, componentsPerVertex: number) {
    super(
      new Attribute(new Float32Array(vec2Array), 0, -1, 4 * componentsPerVertex),
      0,
      ComponentType.Float,
      componentsPerVertex,
      -1,
    );
  }
}
