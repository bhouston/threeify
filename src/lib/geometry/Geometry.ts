//
// based on Mesh from glTF
//
// Authors:
// * @bhouston
//

import { IDisposable, IVersionable } from '../core/types.js';
import { PrimitiveType } from '../renderers/webgl/buffers/PrimitiveType.js';
import { Attribute } from './Attribute.js';

export class Geometry implements IVersionable, IDisposable {
  disposed = false;
  version = 0;
  indices: Attribute | undefined = undefined;
  attributes: { [key: string]: Attribute | undefined } = {};
  primitive: PrimitiveType = PrimitiveType.Triangles;

  dirty(): void {
    this.version++;
  }

  dispose(): void {
    if (!this.disposed) {
      // reaching deep to dispose of all attribute views, but technically they may be reused with other geometries.
      for (const name in this.attributes) {
        const attribute = this.attributes[name];
        if (attribute !== undefined) {
          attribute.attributeData.dispose();
        }
      }
      this.disposed = true;
      this.dirty();
    }
  }
}
