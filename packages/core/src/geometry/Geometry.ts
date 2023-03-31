//
// based on Mesh from glTF
//
// Authors:
// * @bhouston
//

import { Box3, box3Empty } from '@threeify/math';

import { generateUUID } from '../core/generateUuid.js';
import { PrimitiveType } from '../renderers/webgl/buffers/PrimitiveType.js';
import { Attribute } from './Attribute.js';
import { positionAttributeToBoundingBox } from './Geometry.Functions.js';

export class Geometry {
  name = '';
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

  clone(shallow = false): Geometry {
    const clone = new Geometry();
    clone.name = this.name + '.clone';
    clone.primitive = this.primitive;
    if (this.indices !== undefined) {
      clone.indices = shallow ? this.indices : this.indices.clone();
    }
    for (const name in this.attributes) {
      const attribute = this.attributes[name];
      if (attribute === undefined) continue;
      clone.attributes[name] = shallow ? attribute : attribute.clone();
    }
    return clone;
  }
}
