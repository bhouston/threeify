//
// based on BufferView from glTF
//
// Authors:
// * @bhouston
//

import { BufferTarget } from "./BufferTarget.js";
import { IVersioned } from "../interfaces/IVersioned.js";

export class AttributeView implements IVersioned {

    version: number = 0;
    arrayBuffer: ArrayBuffer;
    byteOffset: number;
    byteLength: number;
    byteStride: number;
    target: BufferTarget; // TODO: Can one infer this in the renderer rather than specifying it here?
    
    constructor( arrayBuffer: ArrayBuffer, byteOffset: number, byteLength: number, byteStride: number, target: BufferTarget = BufferTarget.Array ) {

        if( byteLength > arrayBuffer.byteLength ) throw new Error( "byteLength too long" );
        
        this.arrayBuffer = arrayBuffer;
        this.byteOffset = byteOffset;
        this.byteLength = ( byteLength < 0 ) ? arrayBuffer.byteLength : byteLength;
        this.byteStride = byteStride;
        this.target = target;

    }

    dirty() {
        this.version ++;
    }

}