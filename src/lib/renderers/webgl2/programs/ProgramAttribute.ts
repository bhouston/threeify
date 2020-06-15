//
// program attribute from introspection
//
// Authors:
// * @bhouston
//

import { Program } from "./Program";

export class ProgramAttribute {
  name: string;
  size: number;
  type: number;
  glLocation: number; // attributes are indexed

  constructor(public program: Program, public index: number) {
    this.name = name;

    const gl = program.context.gl;

    // look up uniform locations
    {
      const activeInfo = gl.getActiveAttrib(program.glProgram, index);
      if (!activeInfo) {
        throw new Error(`can not find attribute with index: ${index}`);
      }

      this.name = activeInfo.name;
      this.size = activeInfo.size;
      this.type = activeInfo.type;

      const glLocation = gl.getAttribLocation(program.glProgram, this.name);
      if (glLocation < 0) {
        throw new Error(`can not find attribute named: ${this.name}`);
      }

      this.glLocation = glLocation;
    }
  }
}
