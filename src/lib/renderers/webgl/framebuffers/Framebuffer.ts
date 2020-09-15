//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { Vector2 } from "../../../math/Vector2";
import { GL } from "../GL";
import { RenderingContext } from "../RenderingContext";
import { TexImage2D } from "../textures/TexImage2D";
import { Attachment } from "./Attachment";
import { VirtualFramebuffer } from "./VirtualFramebuffer";

export type AttachmentMap = { [point: number]: TexImage2D | undefined };

export class Framebuffer extends VirtualFramebuffer {
  readonly id: number;
  readonly glFramebuffer: WebGLFramebuffer;
  readonly #size: Vector2 = new Vector2();
  private _attachments: AttachmentMap = {};

  constructor(context: RenderingContext) {
    super(context);

    const gl = this.context.gl;

    {
      const glFramebuffer = gl.createFramebuffer();
      if (glFramebuffer === null) {
        throw new Error("createFramebuffer failed");
      }

      this.glFramebuffer = glFramebuffer;
    }

    this.id = this.context.registerResource(this);
  }

  attach(attachmentPoint: Attachment, texImage2D: TexImage2D, target = texImage2D.target, level = 0): void {
    const gl = this.context.gl;

    gl.bindFramebuffer(GL.FRAMEBUFFER, this.glFramebuffer);
    gl.framebufferTexture2D(GL.FRAMEBUFFER, attachmentPoint, target, texImage2D.glTexture, level);
    this._attachments[attachmentPoint] = texImage2D;
    this.size.copy(texImage2D.size);
    gl.bindFramebuffer(GL.FRAMEBUFFER, null);
  }

  getAttachment(attachmentPoint: Attachment): TexImage2D | undefined {
    return this._attachments[attachmentPoint];
  }

  get size(): Vector2 {
    return this.#size;
  }

  dispose(): void {
    if (!this.disposed) {
      const gl = this.context.gl;
      gl.deleteFramebuffer(this.glFramebuffer);
      this.context.disposeResource(this);
      this.disposed = true;
    }
  }
}
