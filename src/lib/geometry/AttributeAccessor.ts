//
// based on Accessor from glTF
//
// Authors:
// * @bhouston
//

import { AttributeView } from './AttributeView.js'
import { componentTypeSizeOf, ComponentType } from './ComponentType.js';

export class AttributeAccessor {

    attributeView: AttributeView;
    byteOffset: number;
    componentType: ComponentType;
    componentsPerVertex: number;
    count: number;
     //minExtent: ComponentType;
    //maxExtent: ComponentType;

    constructor( attributeView: AttributeView, byteOffset: number, componentType: ComponentType, componentsPerVertex: number, count: number ) {

        this.attributeView = attributeView;
        this.byteOffset = byteOffset;
        this.componentType = componentType;
        this.componentsPerVertex = componentsPerVertex;
        this.count = count;
        //this.minExtent = minExtent;
        //this.maxExtent = maxExtent;
    }

    get byteLength() : number {
        return componentTypeSizeOf( this.componentType ) * this.componentsPerVertex * this.count;
    }

}
