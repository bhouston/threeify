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
    byteLength: number;
     //minExtent: ComponentType;
    //maxExtent: ComponentType;

    constructor( attributeView: AttributeView, byteOffset: number, componentType: ComponentType, componentsPerVertex: number, count: number ) {

        this.attributeView = attributeView;
        this.byteOffset = byteOffset;
        this.componentType = componentType;
        this.componentsPerVertex = componentsPerVertex;

        let bytesPerComponent = componentTypeSizeOf( this.componentType );
        this.count = ( count < 0 ) ? ( attributeView.byteLength / bytesPerComponent ) : count;
        this.byteLength = bytesPerComponent * this.componentsPerVertex * this.count;
        //this.minExtent = minExtent;
        //this.maxExtent = maxExtent;
    }

}
