//
// basic shader
//
// Authors:
// * @bhouston
//

import { Context } from "./Context";
import { Program } from "./Program";

export class VertexArrayObject {

    program: Program;
    glVertexArrayObject: WebGLVertexArrayObject;

    constructor(program: Program, buffers: Buffer[]) {

        this.program = program;

        let gl = this.program.context.gl;

        {
            // Create a vertex array object (attribute state)
            var vao = gl.createVertexArray();
            if( ! vao ) {
                throw new Error( "can not create vertex array object" );
            }
            this.glVertexArrayObject = vao;
        }
    }

    bind( buffers: Buffer[] ) {

        let gl = this.program.context.gl;

        // and make it the one we're currently working with
        gl.bindVertexArray(this.glVertexArrayObject);

        this.program.attributes.forEach( attribute => {

     /*       // Turn on the attribute
            gl.enableVertexAttribArray(positionAttributeLocation);

            // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            var size = 2;          // 2 components per iteration
            var type = gl.FLOAT;   // the data is 32bit floats
            var normalize = false; // don't normalize the data
            var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            var offset = 0;        // start at the beginning of the buffer
            gl.vertexAttribPointer(
                positionAttributeLocation, size, type, normalize, stride, offset);*/

        });

    }
}