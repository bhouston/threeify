//
// Authors:
// * @bhouston
//

import { Accessor } from './Accessor.js'
import { Vector2 } from '../math/Vector2.js'
import { Vector3 } from '../math/Vector3.js'

export class IndexedGeometry {

    indices: Accessor;
    positions: Accessor;
    normals: Accessor;
    uvs: Accessor; // TODO: turn into an array (indices) or map (named)

    constructor(
        indices: Accessor,
        positions: Accessor,
        normals: Accessor,
        uvs: Accessor ) {

        this.indices = indices;
        this.positions = positions;
        this.normals = normals;
        this.uvs = uvs;

    }

}
