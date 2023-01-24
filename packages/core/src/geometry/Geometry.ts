//
// based on Mesh from glTF
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../core/generateUuid.js';
import { box3Empty } from '../math/Box3.Functions.js';
import { Box3 } from '../math/Box3.js';
import { PrimitiveType } from '../renderers/webgl/buffers/PrimitiveType.js';
import { Attribute } from './Attribute.js';
import { positionAttributeToBoundingBox } from './Geometry.Functions.js';

export class Geometry {
  id: string = generateUUID();
  indices: Attribute | undefined = undefined;
  attributes: { [key: string]: Attribute | undefined } = {};
  primitive: PrimitiveType = PrimitiveType.Triangles;

  #boundingBoxVersion = -1;
  #boundingBox = new Box3();

  boundingBox() {
    const positions = this.attributes.positions;
    if (positions === undefined) {
      box3Empty(this.#boundingBox);
    } else if (this.#boundingBoxVersion < positions.attributeData.version) {
      this.#boundingBoxVersion = positions.attributeData.version;
      this.#boundingBox = positionAttributeToBoundingBox(
        this.attributes.positions
      );
    }
    return this.#boundingBox;
  }
}
