//
// renderable mesh geometry, cached via a Vertex Array Object
// roughly based on this design: http://ogldev.atspace.co.uk/www/tutorial32/tutorial32.html
//
// Authors:
// * @bhouston
//

import { Context } from "./Context.js";
import { VertexAttribute } from "./VertexAttribute.js";

export class BufferGeometry {

    indices: VertexAttribute;
    positions: VertexAttribute;
    normals: VertexAttribute;
    uvs: VertexAttribute; // TODO: turn into an array (indices) or map (named)

    constructor(
        indices: VertexAttribute,
        positions: VertexAttribute,
        normals: VertexAttribute,
        uvs: VertexAttribute ) {

        this.indices = indices;
        this.positions = positions;
        this.normals = normals;
        this.uvs = uvs;
    }

}
