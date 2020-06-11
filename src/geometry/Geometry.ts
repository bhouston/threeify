//
// based on Mesh from glTF
//
// Authors:
// * @bhouston
//

import { Dictionary } from "../core/Dictionary";
import { IDisposable, IVersionable } from "../core/types";
import { PrimitiveType } from "../renderers/webgl2/PrimitiveType";
import { AttributeAccessor } from "./AttributeAccessor";

export class Geometry implements IVersionable, IDisposable {
  disposed = false;
  version = 0;
  indices: AttributeAccessor | null = null;
  attributeAccessors = new Dictionary<string, AttributeAccessor>();
  primitive: PrimitiveType = PrimitiveType.Triangles;

  dirty(): void {
    this.version++;
  }

  dispose(): void {
    if (!this.disposed) {
      // reaching deep to dispose of all attribute views, but technically they may be reused with other geometries.
      this.attributeAccessors.forEach((attributeAccessor) => {
        attributeAccessor.attributeView.dispose();
      });
      this.disposed = true;
      this.dirty();
    }
  }

  setIndices(indices: AttributeAccessor): void {
    this.indices = indices;
  }
}
