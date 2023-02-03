//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { Vec2 } from '@threeify/vector-math';

import { generateUUID } from '../../../core/generateUuid.js';
import { GL } from '../GL.js';
import { IResource } from '../IResource.js';
import { RenderingContext } from '../RenderingContext.js';
import { TexImage2D } from '../textures/TexImage2D.js';
import { Attachment } from './Attachment.js';
import { VirtualFramebuffer } from './VirtualFramebuffer.js';

export type AttachmentMap = { [point: number]: TexImage2D | undefined };

export class Framebuffer extends VirtualFramebuffer implements IResource {
  public readonly id = generateUUID();
  readonly glFramebuffer: WebGLFramebuffer;
  readonly #size: Vec2 = new Vec2();
  private _attachments: AttachmentMap = {};

  constructor(context: RenderingContext) {
    super(context);

    const { gl, resources } = this.context;

    {
      const glFramebuffer = gl.createFramebuffer();
      if (glFramebuffer === null) {
        throw new Error('createFramebuffer failed');
      }

      this.glFramebuffer = glFramebuffer;
    }

    resources.register(this);
  }

  attach(
    attachmentPoint: Attachment,
    texImage2D: TexImage2D,
    target = texImage2D.target,
    level = 0
  ): void {
    const { gl } = this.context;

    gl.bindFramebuffer(GL.FRAMEBUFFER, this.glFramebuffer);

    gl.framebufferTexture2D(
      GL.FRAMEBUFFER,
      attachmentPoint,
      target,
      texImage2D.glTexture,
      level
    );
    this._attachments[attachmentPoint] = texImage2D;
    this.size.copy(texImage2D.size);

    gl.bindFramebuffer(GL.FRAMEBUFFER, null);
  }

  getAttachment(attachmentPoint: Attachment): TexImage2D | undefined {
    return this._attachments[attachmentPoint];
  }

  get size(): Vec2 {
    return this.#size;
  }

  dispose(): void {
    if (this.disposed) return;

    const { gl, resources } = this.context;
    gl.deleteFramebuffer(this.glFramebuffer);
    resources.unregister(this);
    this.disposed = true;
  }
}
