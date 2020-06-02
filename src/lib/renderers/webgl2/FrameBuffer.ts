import { Context } from "./Context";
import { Vector2 } from "../../math/Vector2";
import { IDisposable } from "../../interfaces/Standard";
import { VertexArrayObject } from "./VertexArrayObject";
import { Program } from "./Program";
import { ProgramUniform } from "./ProgramUniform";
import { Color } from "../../math/Color";

export class Framebuffer implements IDisposable {
    disposed: boolean = false;
    context: Context;
    glFramebuffer: WebGLFramebuffer;

    constructor( context: Context ) {
        this.context = context;

        let gl = this.context.gl;

        {
            let glFramebuffer = gl.createFramebuffer();
            if (!glFramebuffer) {
                throw new Error('can not create frame buffer');
            }
            this.glFramebuffer = glFramebuffer;
        }
    }

    dispose() {
        if( ! this.disposed ) {
            let gl = this.context.gl;
            gl.deleteFramebuffer( this.glFramebuffer )
            this.disposed = true;
        }
    }

    clear( color: Color, alpha: number ) {
        throw new Error( "not implemented");
    }

    render( program: Program, vao: VertexArrayObject, uniforms: Array<ProgramUniform> ) {
        throw new Error( "not implemented");           
    }

}