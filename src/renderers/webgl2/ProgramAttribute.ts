//
// program attribute from introspection
//
// Authors:
// * @bhouston
//

import { Program } from "./Program.js";

export class ProgramAttribute {
  program: Program;
  index: number;
  name: string;
  size: number;
  type: number;
  glLocation: number; // attributes are indexed

  constructor(program: Program, index: number) {
    this.program = program;
    this.index = index;
    this.name = name;

    let gl = program.context.gl;

    // look up uniform locations
    {
      let activeInfo = gl.getActiveAttrib(program.glProgram, index);
      if (!activeInfo)
        throw new Error(`can not find attribute with index: ${index}`);

      this.name = activeInfo.name;
      this.size = activeInfo.size;
      this.type = activeInfo.type;

      let glLocation = gl.getAttribLocation(program.glProgram, this.name);
      if (glLocation < 0)
        throw new Error(`can not find attribute named: ${this.name}`);

      this.glLocation = glLocation;
    }
  }
}
