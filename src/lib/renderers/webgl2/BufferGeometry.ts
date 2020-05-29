//
// renderable mesh geometry, cached via a Vertex Array Object
// roughly based on this design: http://ogldev.atspace.co.uk/www/tutorial32/tutorial32.html
//
// Authors:
// * @bhouston
//

import { Context } from "./Context.js";
import { VertexAttribute } from "./VertexAttribute.js";

class NamedVertexAttribute {

    name: string;
    vertexAttribute: VertexAttribute;

    constructor( name: string, vertexAttribute: VertexAttribute ) {
        this.name = name;
        this.vertexAttribute = vertexAttribute;
    }

}

export class BufferGeometry { // TODO: find a better name/abstraction for this.  VertexAttributeSet?  NamedVertexAttributes?

    indices: VertexAttribute | null = null;
    namedVertexAttributes: NamedVertexAttribute[] = [];

    constructor() {
    }

    setIndices( indices: VertexAttribute ) {
        this.indices = indices;
    }

    setAttribute( name: string, vertexAttribute: VertexAttribute ) {

        // TODO: Figure out how to do this more efficiently and less verbosely.
        let namedVertexAttribute = this.namedVertexAttributes.find( item => item.name === name );
        if( namedVertexAttribute ) {
            namedVertexAttribute.vertexAttribute = vertexAttribute;
        }
        else {
            this.namedVertexAttributes.push( new NamedVertexAttribute( name, vertexAttribute ) );
        }

    }

}
