//
// Authors:
// * @bhouston
//

import { Accessor } from './Accessor.js'
import { Vector2 } from '../math/Vector2.js'
import { Vector3 } from '../math/Vector3.js'

export class Geometry {

    positions: Accessor;
    normals: Accessor;
    uvs: Accessor; // TODO: turn into an array (indices) or map (named)

    constructor(
        positions: Accessor,
        normals: Accessor,
        uvs: Accessor ) {

        this.positions = positions;
        this.normals = normals;
        this.uvs = uvs;

    }

}
