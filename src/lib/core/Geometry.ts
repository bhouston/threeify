//
// based on Mesh from glTF
//
// Authors:
// * @bhouston
//

import { AttributeAccessor } from './AttributeAccessor.js'
import { Vector2 } from '../math/Vector2.js'
import { Vector3 } from '../math/Vector3.js'
import { IVersionable } from '../interfaces/Standard.js';

class NamedAttributeAccessor {

    name: string;
    attributeAccessor: AttributeAccessor;

    constructor( name: string, attributeAccessor: AttributeAccessor ) {
        this.name = name;
        this.attributeAccessor = attributeAccessor;
    }

}

export class Geometry implements IVersionable {

    version: number = 0;
    indices: AttributeAccessor | null = null;
    namedAttributeAccessors: NamedAttributeAccessor[] = [];

    constructor() {
    }

    dirty() {
        this.version ++;
    }

    setIndices( indices: AttributeAccessor ) {
        this.indices = indices;
    }

    setAttribute( name: string, attributeAccessor: AttributeAccessor ) {

        // TODO: Figure out how to do this more efficiently and less verbosely.
        let namedAttributeAccessor = this.namedAttributeAccessors.find( item => item.name === name );
        if( namedAttributeAccessor ) {
            namedAttributeAccessor.attributeAccessor = attributeAccessor;
        }
        else {
            this.namedAttributeAccessors.push( new NamedAttributeAccessor( name, attributeAccessor ) );
        }

    }

    findAttribute( name: string ) : AttributeAccessor | null {
        let namedAttributeAccessor = this.namedAttributeAccessors.find( item => item.name === name );
        return ( namedAttributeAccessor ) ? namedAttributeAccessor.attributeAccessor : null;
    }

}
