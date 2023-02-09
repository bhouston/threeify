//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { Vec2 } from '@threeify/math';

import { generateUUID } from '../../../core/generateUuid.js';
import { GL } from '../GL.js';
import { IResource } from '../IResource.js';
import { Renderbuffer } from '../renderbuffers/Renderbuffer.js';
import { RenderingContext } from '../RenderingContext.js';
import { TexImage2D } from '../textures/TexImage2D.js';
import { TextureTarget } from '../textures/TextureTarget.js';
import { Attachment } from './Attachment.js';
import { VirtualFramebuffer } from './VirtualFramebuffer.js';

export type AttachmentMap = {
  [point: number]: TexImage2D | Renderbuffer | undefined;
};

export class Framebuffer extends VirtualFramebuffer implements IResource {
  public readonly id = generateUUID();
  public readonly glFramebuffer: WebGLFramebuffer;
  public readonly size: Vec2 = new Vec2();
  private readonly attachments: Map<number, TexImage2D | Renderbuffer> =
    new Map();

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
    attachment: TexImage2D | Renderbuffer,
    target: TextureTarget | undefined = undefined,
    level = 0
  ): void {
    const { gl } = this.context;

    gl.bindFramebuffer(GL.FRAMEBUFFER, this.glFramebuffer);

    if (attachment instanceof TexImage2D) {
      const texImage2D = attachment as TexImage2D;
      gl.framebufferTexture2D(
        GL.FRAMEBUFFER,
        attachmentPoint,
        target ?? texImage2D.target,
        texImage2D.glTexture,
        level
      );
    } else if (attachment instanceof Renderbuffer) {
      const renderbuffer = attachment as Renderbuffer;
      gl.framebufferRenderbuffer(
        GL.FRAMEBUFFER,
        attachmentPoint,
        GL.RENDERBUFFER, // I copied this value from Three.js, but I am not sure it is correct?  But maybe?
        renderbuffer.glRenderbuffer
      );
    }

    this.attachments.set(attachmentPoint, attachment);
    this.size.copy(attachment.size); // TODO: What to do with conflicting sizes of attachments?

    gl.bindFramebuffer(GL.FRAMEBUFFER, null);
  }

  getAttachment(
    attachmentPoint: Attachment
  ): TexImage2D | Renderbuffer | undefined {
    return this.attachments.get(attachmentPoint);
  }
  dispose(): void {
    if (this.disposed) return;

    const { gl, resources } = this.context;
    gl.deleteFramebuffer(this.glFramebuffer);
    resources.unregister(this);
    this.disposed = true;
  }
}
