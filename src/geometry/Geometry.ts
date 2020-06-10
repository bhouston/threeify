//
// based on Mesh from glTF
//
// Authors:
// * @bhouston
//

import { IDisposable, IVersionable } from "../core/types";
import { AttributeAccessor } from "./AttributeAccessor";
import { PrimitiveType } from "../renderers/webgl2/PrimitiveType";

class NamedAttributeAccessor {
  name: string;
  attributeAccessor: AttributeAccessor;

  constructor(name: string, attributeAccessor: AttributeAccessor) {
    this.name = name;
    this.attributeAccessor = attributeAccessor;
  }
}

export class Geometry implements IVersionable, IDisposable {
  disposed = false;
  version = 0;
  indices: AttributeAccessor | null = null;
  namedAttributeAccessors: NamedAttributeAccessor[] = []; // TODO replace with a map for faster access
  primitive: PrimitiveType = PrimitiveType.Triangles;

  dirty(): void {
    this.version++;
  }

  dispose(): void {
    if (!this.disposed) {
      // reaching deep to dispose of all attribute views, but technically they may be reused with other geometries.
      this.namedAttributeAccessors.forEach((namedAttributeAccessor) => {
        namedAttributeAccessor.attributeAccessor.attributeView.dispose();
      });
      this.disposed = true;
      this.dirty();
    }
  }

  setIndices(indices: AttributeAccessor): void {
    this.indices = indices;
  }

  setAttribute(name: string, attributeAccessor: AttributeAccessor): void {
    // TODO this.namedAttributeAccessors replace with a map for faster access
    const namedAttributeAccessor = this.namedAttributeAccessors.find((item) => item.name === name);
    if (namedAttributeAccessor) {
      namedAttributeAccessor.attributeAccessor = attributeAccessor;
    } else {
      this.namedAttributeAccessors.push(new NamedAttributeAccessor(name, attributeAccessor));
    }
  }

  findAttribute(name: string): AttributeAccessor | null {
    // TODO this.namedAttributeAccessors replace with a map for faster access
    const namedAttributeAccessor = this.namedAttributeAccessors.find((item) => item.name === name);
    return namedAttributeAccessor ? namedAttributeAccessor.attributeAccessor : null;
  }
}
