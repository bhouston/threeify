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

export class ShaderMaterial
	implements IIdentifiable, IVersionable, IDisposable {
	uuid: string = generateUUID();
	version: number = 0;
	disposed: boolean = false;
	name: string = '';
	vertexShaderSourceCode: string;
	fragmentShaderSourceCode: string;

	constructor(
		vertexShaderSourceCode: string,
		fragmentShaderSourceCode: string,
	) {
		this.vertexShaderSourceCode = vertexShaderSourceCode;
		this.fragmentShaderSourceCode = fragmentShaderSourceCode;
	}

	dirty() {
		this.version++;
	}

	dispose() {
		this.disposed = true;
		this.dirty();
	}
}
