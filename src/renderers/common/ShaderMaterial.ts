//
// basic shader material
//
// Authors:
// * @bhouston

export class ShaderMaterial {
  // attributes (required attribute buffers)
  // varying (per instance parameters)

  constructor(public vertexSourceCode: string, public fragmentSourceCode: string) {}
}
