//
// based on BufferView from glTF
//
// Authors:
// * @bhouston
//

export class BufferView<PrimitiveArrayType> {

    typedArray: PrimitiveArrayType;
    byteOffset: number;
    byteLength: number;
    byteStride: number;


    constructor( arrayBuffer: PrimitiveArrayType, byteOffset: number = 0, byteLength: number = 0, byteStride: number = 0 ) {

        this.typedArray = arrayBuffer;
        this.byteOffset = byteOffset;
        this.byteLength = byteLength;
        this.byteStride = byteStride;

    }

}
