//
// based on BufferView from glTF
//
// Authors:
// * @bhouston
//

import { DataType } from "./DataType";

export class BufferView {

    arrayBuffer: ArrayBuffer;
    dataType: DataType;
    byteOffset: number;
    byteLength: number;
    byteStride: number;


    constructor( arrayBuffer: ArrayBuffer, dataType: DataType, byteOffset: number = 0, byteLength: number = 0, byteStride: number = 0 ) {

        this.arrayBuffer = arrayBuffer;
        this.dataType = dataType;
        this.byteOffset = byteOffset;
        this.byteLength = byteLength;
        this.byteStride = byteStride;

    }

}
