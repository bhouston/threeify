//
// based on Mesh from glTF
//
// Authors:
// * @bhouston
//

import { Box3, box3Empty } from '@threeify/math';

import { generateUUID } from '../core/generateUuid';
import { PrimitiveType } from '../renderers/webgl/buffers/PrimitiveType';
import { Attribute } from './Attribute';
import { positionAttributeToBoundingBox } from './Geometry.Functions';

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
