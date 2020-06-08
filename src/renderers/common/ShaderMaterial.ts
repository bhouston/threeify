//
// basic shader material
//
// Authors:
// * @bhouston

export class ShaderMaterial {
	vertexSourceCode: string;
	fragmentSourceCode: string;
	// attributes (required attribute buffers)
	// varying (per instance parameters)

	constructor(vertexSourceCode: string, fragmentSourceCode: string) {
		this.vertexSourceCode = vertexSourceCode;
		this.fragmentSourceCode = fragmentSourceCode;
	}
}
