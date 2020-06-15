//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { RenderingContext } from "../RenderingContext";
import { FramebufferAttachment, VirtualFramebuffer } from "./VirtualFramebuffer";

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
      const gl = this.context.gl;
      gl.deleteFramebuffer(this.glFramebuffer);
      this.disposed = true;
    }
  }
}
