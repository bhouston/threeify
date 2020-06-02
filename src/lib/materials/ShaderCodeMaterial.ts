//
// basic shader material
//
// Authors:
// * @bhouston
//

import {
	IDisposable,
	IVersionable,
	IIdentifiable,
} from '../interfaces/Standard.js';
import { generateUUID } from '../generateUuid.js';
import { IPoolUser } from '../renderers/Pool.js';

export class ShaderCodeMaterial
	implements IIdentifiable, IVersionable, IDisposable, IPoolUser {
	uuid: string = generateUUID();
	version: number = 0;
	disposed: boolean = false;
	name: string = '';
	vertexShaderCode: string;
	fragmentShaderCode: string;

	constructor(vertexShaderCode: string, fragmentShaderCode: string) {
		this.vertexShaderCode = vertexShaderCode;
		this.fragmentShaderCode = fragmentShaderCode;
	}

	dirty() {
		this.version++;
	}

	dispose() {
		this.disposed = true;
		this.dirty();
	}
}
