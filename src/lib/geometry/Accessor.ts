//
// based on Accessor from glTF
//
// Authors:
// * @bhouston
//

import { BufferView } from './BufferView.js'

export class Accessor {

    bufferView: BufferView;
    byteOffset: number;
    byteLength: number;
    count: number;
    //minExtent: ComponentType;
    //maxExtent: ComponentType;

    constructor( bufferView: BufferView, byteOffset: number = 0, byteLength: number = 0 ) {

        this.bufferView = bufferView;
        this.byteOffset = byteOffset;
        this.byteLength = byteLength;
        this.count = this.byteLength / this.bufferView.byteStride;
        //this.minExtent = minExtent;
        //this.maxExtent = maxExtent;
    }

}
