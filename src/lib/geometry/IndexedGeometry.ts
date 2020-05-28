//
// Authors:
// * @bhouston
//

import { Accessor } from './Accessor.js'
import { Vector2 } from '../math/Vector2.js'
import { Vector3 } from '../math/Vector3.js'

export class IndexedGeometry {

    indices: Accessor<Int32Array,number>;
    positions: Accessor<Float32Array,Vector3>;
    normals: Accessor<Float32Array,Vector3>;
    uvs: Accessor<Float32Array,Vector2>; // TODO: turn into an array (indices) or map (named)

    constructor(
        indices: Accessor<Int32Array,number>,
        positions: Accessor<Float32Array,Vector3>,
        normals: Accessor<Float32Array,Vector3>,
        uvs: Accessor<Float32Array,Vector2> ) {

        this.indices = indices;
        this.positions = positions;
        this.normals = normals;
        this.uvs = uvs;

    }

}
