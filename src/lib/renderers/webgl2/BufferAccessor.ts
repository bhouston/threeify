//
// maps onto void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
//
// Authors:
// * @bhouston
//

import { Buffer } from './Buffer.js'
import { ComponentType, componentTypeSizeOf } from '../../core/ComponentType.js';

export class BufferAccessor {

    buffer: Buffer;
    componentType: ComponentType;
    componentsPerVertex: number;
    normalized: boolean;
    vertexStride: number;
    byteOffset: number;

    constructor( buffer: Buffer, componentType: ComponentType, componentsPerVertex: number, normalized: boolean, vertexStride: number, byteOffset: number ) {

        this.buffer = buffer;
        this.byteOffset = byteOffset;
        this.componentType = componentType;
        this.componentsPerVertex = componentsPerVertex;
        this.normalized = normalized;
        this.vertexStride = vertexStride;
        this.byteOffset = byteOffset;
    }

}
