//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//


import { IDisposable } from "../../interfaces/Standard";
import { Color } from "../../math/Color";
import { Context } from "./Context";
import { Program } from "./Program";
import { ProgramUniform } from "./ProgramUniform";
import { TextureImage2D } from "./TextureImage2D";
import { VertexArrayObject } from "./VertexArrayObject";

const GL = WebGLRenderingContext;

export enum AttachmentPoints {
    Color0 = GL.COLOR_ATTACHMENT0,
    Depth  =GL.DEPTH_ATTACHMENT,
    DepthStencil  =GL.DEPTH_STENCIL_ATTACHMENT,
    Stencil  =GL.STENCIL_ATTACHMENT,
}

export enum AttachmentFlags {
    Color = GL.COLOR_BUFFER_BIT,
    Depth = GL.DEPTH_BUFFER_BIT,
    Stencil = GL.STENCIL_BUFFER_BIT,
}

export class FramebufferAttachment {
    attachmentPoint: number;
    textureImage2D: TextureImage2D;

    constructor( attachmentPoint: number, textureImage2D: TextureImage2D ) {
        this.attachmentPoint = attachmentPoint;
        this.textureImage2D = textureImage2D;
    }

}

export class Framebuffer implements IDisposable {
    disposed: boolean = false;
    context: Context;
    attachments: Array<FramebufferAttachment>;
    glFramebuffer: WebGLFramebuffer;

    constructor( context: Context, attachments: Array<FramebufferAttachment> ) {
        this.context = context;
        this.attachments = attachments;

        let gl = this.context.gl;
        {
            let glFramebuffer = gl.createFramebuffer();
            if (!glFramebuffer) {
                throw new Error('can not create frame buffer');
            }
            this.glFramebuffer = glFramebuffer;
        }

        attachments.forEach( attachment => {
            gl.framebufferTexture2D( gl.FRAMEBUFFER, attachment.attachmentPoint, gl.TEXTURE_2D, attachment.textureImage2D, 0 );
        });
    }

    dispose() {
        if( ! this.disposed ) {
            let gl = this.context.gl;
            gl.deleteFramebuffer( this.glFramebuffer )
            this.disposed = true;
        }
    }

    clear( color: Color, alpha: number, attachmentFlags: AttachmentFlags = ( AttachmentFlags.Color | AttachmentFlags.Depth ) ) {
        let gl = this.context.gl;

        // render to our targetTexture by binding the framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer);
        
        gl.clearColor(color.r, color.g, color.b, alpha);   // clear to blue
        gl.clear( attachmentFlags );
    }   

    render( program: Program, vao: VertexArrayObject, uniforms: Array<ProgramUniform> ) {
        throw new Error( "not implemented");           
    }

}