//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { Vector2 } from "../../../math/Vector2";
import { GL } from "../GL";
import { RenderingContext } from "../RenderingContext";
import { FramebufferAttachment, VirtualFramebuffer } from "./VirtualFramebuffer";

export class Framebuffer extends VirtualFramebuffer {
  readonly glFramebuffer: WebGLFramebuffer;
  readonly #size: Vector2 = new Vector2();

  constructor(context: RenderingContext, attachments: Array<FramebufferAttachment> = []) {
    super(context, attachments);

    const gl = this.context.gl;

    {
      const glFramebuffer = gl.createFramebuffer();
      if (glFramebuffer === null) {
        throw new Error("createFramebuffer failed");
      }

      this.glFramebuffer = glFramebuffer;
    }

    gl.bindFramebuffer(GL.FRAMEBUFFER, this.glFramebuffer);

    attachments.forEach((attachment) => {
      gl.framebufferTexture2D(
        GL.FRAMEBUFFER,
        attachment.attachmentPoint,
        attachment.texImage2D.target,
        attachment.texImage2D.glTexture,
        0,
      );
      this.size.copy(attachment.texImage2D.size);
    });
  }

  get size(): Vector2 {
    return this.#size;
  }

  dispose(): void {
    if (!this.disposed) {
      const gl = this.context.gl;
      gl.deleteFramebuffer(this.glFramebuffer);
      this.disposed = true;
    }
  }
}
