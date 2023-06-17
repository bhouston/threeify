//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { Vec2 } from '@threeify/math';

import { generateUUID } from '../../../core/generateUuid';
import { GL } from '../GL';
import { IResource } from '../IResource';
import { Renderbuffer } from '../renderbuffers/Renderbuffer';
import { RenderingContext } from '../RenderingContext';
import { TexImage2D } from '../textures/TexImage2D';
import { TextureTarget } from '../textures/TextureTarget';
import { Attachment } from './Attachment';
import { VirtualFramebuffer } from './VirtualFramebuffer';

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
  ): this {
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

    return this;
  }

  hasAttachment(attachmentPoint: Attachment): boolean {
    return this.attachments.has(attachmentPoint);
  }
  getAttachment(attachmentPoint: Attachment): TexImage2D | Renderbuffer {
    const attachment = this.attachments.get(attachmentPoint);
    if (attachment === undefined) {
      throw new Error(
        `Framebuffer does not have attachment ${attachmentPoint}`
      );
    }
    return attachment;
  }

  dispose(): void {
    if (this.disposed) return;

    const { gl, resources } = this.context;
    gl.deleteFramebuffer(this.glFramebuffer);
    resources.unregister(this);
    this.disposed = true;
  }
}

export function colorAttachmentToFramebuffer(
  colorTexImage2D: TexImage2D
): Framebuffer {
  const framebuffer = new Framebuffer(colorTexImage2D.context);
  framebuffer.attach(Attachment.Color0, colorTexImage2D);
  return framebuffer;
}

export function colorAndDepthAttachmentToFramebuffer(
  colorTexImage2D: TexImage2D,
  depthTexImage2D: TexImage2D
): Framebuffer {
  const framebuffer = new Framebuffer(colorTexImage2D.context);
  framebuffer.attach(Attachment.Color0, colorTexImage2D);
  framebuffer.attach(Attachment.Depth, depthTexImage2D);
  return framebuffer;
}
