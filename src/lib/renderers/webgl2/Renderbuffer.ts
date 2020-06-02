import { Context } from "./Context";
import { Vector2 } from "../../math/Vector2";
import { IDisposable } from "../../interfaces/Standard";
import { VertexArrayObject } from "./VertexArrayObject";
import { Program } from "./Program";
import { ProgramUniform } from "./ProgramUniform";
import { Color } from "../../math/Color";

export class Renderbuffer implements IDisposable {
    disposed: boolean = false;
    context: Context;
    glRenderbuffer: WebGLRenderbuffer;

    constructor( context: Context ) {
        this.context = context;

        let gl = this.context.gl;

        {
            let glRenderbuffer = gl.createRenderbuffer();
            if (!glRenderbuffer) {
                throw new Error('can not create render buffer');
            }
            this.glRenderbuffer = glRenderbuffer;
        }
    }

    dispose() {
        if( ! this.disposed ) {
            let gl = this.context.gl;
            gl.deleteRenderbuffer( this.glRenderbuffer )
            this.disposed = true;
        }
    }

}
