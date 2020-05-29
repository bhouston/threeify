//
// based on Mesh from glTF
//
// Authors:
// * @bhouston
//

import { AttributeAccessor } from './AttributeAccessor.js'
import { Vector2 } from '../math/Vector2.js'
import { Vector3 } from '../math/Vector3.js'

export class AttributeGeometry {

    indices: AttributeAccessor;
    positions: AttributeAccessor;
    normals: AttributeAccessor;
    uvs: AttributeAccessor; // TODO: turn into an array (indices) or map (named)

    constructor(
        indices: AttributeAccessor,
        positions: AttributeAccessor,
        normals: AttributeAccessor,
        uvs: AttributeAccessor ) {

        this.indices = indices;
        this.positions = positions;
        this.normals = normals;
        this.uvs = uvs;

    }

}
