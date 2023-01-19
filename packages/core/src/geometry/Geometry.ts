//
// based on Mesh from glTF
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../core/generateUuid.js';
import { PrimitiveType } from '../renderers/webgl/buffers/PrimitiveType.js';
import { Attribute } from './Attribute.js';

export class Geometry {
  id: string = generateUUID();
  indices: Attribute | undefined = undefined;
  attributes: { [key: string]: Attribute | undefined } = {};
  primitive: PrimitiveType = PrimitiveType.Triangles;
}
