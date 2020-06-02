//
// based on BufferView from glTF
//
// Authors:
// * @bhouston
//

import { BufferTarget } from './BufferTarget.js';
import { IVersionable, IDisposable, IIdentifiable } from '../interfaces/Standard.js';
import { generateUUID } from '../generateUuid.js';

export class AttributeView implements IIdentifiable, IVersionable, IDisposable {
	uuid: string = generateUUID();
	version: number = 0;
	disposed: boolean = false;
	arrayBuffer: ArrayBuffer;
	byteOffset: number;
	byteLength: number;
	byteStride: number;
	target: BufferTarget; // TODO: Can one infer this in the renderer rather than specifying it here?

	constructor(
		arrayBuffer: ArrayBuffer,
		byteOffset: number,
		byteLength: number,
		byteStride: number,
		target: BufferTarget = BufferTarget.Array,
	) {
		if (byteLength > arrayBuffer.byteLength)
			throw new Error('byteLength too long');

		this.arrayBuffer = arrayBuffer;
		this.byteOffset = byteOffset;
		this.byteLength = byteLength < 0 ? arrayBuffer.byteLength : byteLength;
		this.byteStride = byteStride;
		this.target = target;
	}

	dirty() {
		this.version++;
	}

	dispose() {
		this.disposed = true;
		this.dirty();
	}

}
