//
// renderable mesh geometry, cached via a Vertex Array Object
// roughly based on this design: http://ogldev.atspace.co.uk/www/tutorial32/tutorial32.html
//
// Authors:
// * @bhouston
//

import { Context } from "./Context.js";
import { BufferAccessor } from "./BufferAccessor.js";

export class BufferGeometry {

    indices: BufferAccessor;
    positions: BufferAccessor;
    normals: BufferAccessor;
    uvs: BufferAccessor; // TODO: turn into an array (indices) or map (named)

    constructor(
        indices: BufferAccessor,
        positions: BufferAccessor,
        normals: BufferAccessor,
        uvs: BufferAccessor ) {

        this.indices = indices;
        this.positions = positions;
        this.normals = normals;
        this.uvs = uvs;
    }

}
