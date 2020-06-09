//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { PixelFormat, numPixelFormatComponents } from "../../textures/PixelFormat";
import { Color } from "../../math/Color";
import { IDisposable } from "../../types/types";
import { Program } from "./Program";
import { ProgramUniform } from "./ProgramUniform";
import { RenderingContext } from "./RenderingContext";
import { TexImage2D } from "./TexImage2D";
import { VertexArrayObject } from "./VertexArrayObject";
import { sizeOfDataType } from "../../textures/DataType";
import { ClearState } from "./ClearState";
import { Camera } from "../../nodes/cameras/Camera";
import { Node } from "../../nodes/Node";
import { VirtualFramebuffer } from "./VirtualFramebuffer";

const GL = WebGLRenderingContext;

export enum AttachmentPoints {
  Color0 = GL.COLOR_ATTACHMENT0,
  Depth = GL.DEPTH_ATTACHMENT,
  DepthStencil = GL.DEPTH_STENCIL_ATTACHMENT,
  Stencil = GL.STENCIL_ATTACHMENT,
}

export enum AttachmentFlags {
  Color = GL.COLOR_BUFFER_BIT,
  Depth = GL.DEPTH_BUFFER_BIT,
  Stencil = GL.STENCIL_BUFFER_BIT,
  Default = Color | Depth,
  All = Color | Depth | Stencil,
}

export class FramebufferAttachment {
  constructor(public attachmentPoint: number, public texImage2D: TexImage2D) {}
}

export class Framebuffer extends VirtualFramebuffer {
  glFramebuffer: WebGLFramebuffer;

  constructor(context: RenderingContext, attachments: Array<FramebufferAttachment> = []) {
    super(context, attachments);

    const gl = this.context.gl;

    {
      const glFramebuffer = gl.createFramebuffer();
      if (!glFramebuffer) {
        throw new Error("createFramebuffer failed");
      }

      this.glFramebuffer = glFramebuffer;
    }

    attachments.forEach((attachment) => {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment.attachmentPoint, gl.TEXTURE_2D, attachment.texImage2D, 0);
    });
  }

  dispose(): void {
    if (!this.disposed) {
      if (this.glFramebuffer) {
        const gl = this.context.gl;
        gl.deleteFramebuffer(this.glFramebuffer);
      }
      this.disposed = true;
    }
  }
}
