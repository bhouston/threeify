//
// basic shader
//
// Authors:
// * @bhouston
//

import { Context } from "./Context.js";
import { Program } from "./Program.js";
import { BufferGeometry } from "./BufferGeometry.js";

export class VertexArrayObject {

    program: Program;
    glVertexArrayObject: WebGLVertexArrayObject;

    constructor(program: Program, bufferGeometry: BufferGeometry) {

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

        // and make it the one we're currently working with
        gl.bindVertexArray(this.glVertexArrayObject);

        let namedBufferAccessors = [ // TODO: There is probably a more efficient way to do this via TS introspection
            { name: 'indices', bufferAccessor: bufferGeometry.indices },
            { name: 'position', bufferAccessor: bufferGeometry.positions },
            { name: 'normals', bufferAccessor: bufferGeometry.normals },
            { name: 'uvs', bufferAccessor: bufferGeometry.uvs }
        ];

        namedBufferAccessors.forEach( namedBufferAccessor => {
            let programAttribute = this.program.attributes.find( attribute => ( attribute.name === namedBufferAccessor.name ) );
            if( ! programAttribute ) { // only bind the attributes that exist in the program.
                return;
            }

            gl.enableVertexAttribArray(programAttribute.glLocation);

            let bufferAccessor = namedBufferAccessor.bufferAccessor;
            let buffer = bufferAccessor.buffer;

            // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
            gl.bindBuffer( buffer.target, buffer.glBuffer );

            // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            gl.vertexAttribPointer( programAttribute.glLocation, bufferAccessor.componentsPerVertex, bufferAccessor.componentType, bufferAccessor.normalized, bufferAccessor.vertexStride, bufferAccessor.byteOffset );

        });

    }
}