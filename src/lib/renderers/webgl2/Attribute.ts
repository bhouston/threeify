import { Program } from "./Program";

export class Attribute {

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
            if (!activeInfo) {
                throw new Error("Can not find uniform with index: " + index);
            }

            this.name = activeInfo.name;
            this.size = activeInfo.size;
            this.type = activeInfo.type;

            var glLocation = gl.getAttribLocation(program.glProgram, this.name);
            if ( glLocation < 0 ) {
                throw new Error("Can not find attribute named: " + this.name);
            }
            this.glLocation = glLocation;
            
        }

    }

}
