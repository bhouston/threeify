//
// based on BufferView from glTF
//
// Authors:
// * @bhouston
//

import { AttributeArray } from "./AttributeArray.js";
import { BufferTarget } from "./BufferTarget.js";

export class AttributeView {

    attributeArray: AttributeArray;
    byteOffset: number;
    byteLength: number;
    byteStride: number;
    target: BufferTarget; // TODO: Can one infer this in the renderer rather than specifying it here?

    constructor( attributeArray: AttributeArray, byteOffset: number, byteLength: number, byteStride: number, target: BufferTarget = BufferTarget.Array ) {

        this.attributeArray = attributeArray;
        this.byteOffset = byteOffset;
        this.byteLength = byteLength;
        this.byteStride = byteStride;
        this.target = target;

    }

}