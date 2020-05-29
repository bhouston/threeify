//
// renderable mesh geometry, cached via a Vertex Array Object
// roughly based on this design: http://ogldev.atspace.co.uk/www/tutorial32/tutorial32.html
//
// Authors:
// * @bhouston
//

import { Context } from "./Context.js";
import { VertexAttribute } from "./VertexAttribute.js";
import { Geometry } from "../../core/Geometry.js";

class NamedVertexAttribute {

    name: string;
    vertexAttribute: VertexAttribute;

    constructor( name: string, vertexAttribute: VertexAttribute ) {
        this.name = name;
        this.vertexAttribute = vertexAttribute;
    }

}

export class VertexAttributeGeometry {

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

    static FromGeometry( context: Context, geometry: Geometry ) {

        var vertexAttributeGeometry = new VertexAttributeGeometry();
      
        if( geometry.indices ) {
          vertexAttributeGeometry.setIndices( VertexAttribute.FromAttributeAccessor( context, geometry.indices ) );
        }
      
        geometry.namedAttributeAccessors.forEach( item => {
          vertexAttributeGeometry.setAttribute( item.name, VertexAttribute.FromAttributeAccessor( context, item.attributeAccessor ) );
        } );
      
        return vertexAttributeGeometry;
      
    }

}
