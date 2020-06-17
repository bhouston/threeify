//
// based on Mesh from glTF
//
// Authors:
// * @bhouston
//

import { Dictionary } from "../core/Dictionary";
import { IDisposable, IVersionable } from "../core/types";
import { PrimitiveType } from "../renderers/webgl2/buffers/PrimitiveType";
import { Attribute } from "./Attribute";

export class Geometry implements IVersionable, IDisposable {
  disposed = false;
  version = 0;
  indices: Attribute | undefined = undefined;
  attributes = new Dictionary<string, Attribute>();
  primitive: PrimitiveType = PrimitiveType.Triangles;

  dirty(): void {
    this.version++;
  }

  dispose(): void {
    if (!this.disposed) {
      // reaching deep to dispose of all attribute views, but technically they may be reused with other geometries.
      this.attributes.forEach((attribute) => {
        attribute.attributeData.dispose();
      });
      this.disposed = true;
      this.dirty();
    }
  }
}
