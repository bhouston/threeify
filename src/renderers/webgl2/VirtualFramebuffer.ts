//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { IDisposable } from "../../core/types";
import { Camera } from "../../nodes/cameras/Camera";
import { Node } from "../../nodes/Node";
import { sizeOfDataType } from "../../textures/DataType";
import { numPixelFormatComponents, PixelFormat } from "../../textures/PixelFormat";
import { Attachments } from "./Attachments";
import { AttachmentPoints } from "./AttachmentPoints";
import { ClearState } from "./ClearState";
import { Program } from "./Program";
import { RenderingContext } from "./RenderingContext";
import { TexImage2D } from "./TexImage2D";
import { VertexArrayObject } from "./VertexArrayObject";

const GL = WebGLRenderingContext;

export class FramebufferAttachment {
  constructor(public attachmentPoint: number, public texImage2D: TexImage2D) {}
}

export abstract class VirtualFramebuffer implements IDisposable {
  disposed = false;
  context: RenderingContext;
  attachments: Array<FramebufferAttachment>;
  private _clearState: ClearState = new ClearState();

  constructor(context: RenderingContext, attachments: Array<FramebufferAttachment> = []) {
    this.context = context;
    this.attachments = attachments;
  }

  abstract dispose(): void;

  get clearState(): ClearState {
    return this._clearState.clone();
  }
  set clearState(clearState: ClearState) {
    this._clearState = clearState;
  }

  clear(
    attachmentFlags: Attachments = Attachments.Color | Attachments.Depth,
    clearState: ClearState | null = null,
  ): void {
    if (clearState) {
      this.context.clearState = clearState;
    } else {
      this.context.clearState = this.clearState;
    }

    this.context.framebuffer = this;
    const gl = this.context.gl;
    gl.clear(attachmentFlags);
  }

  renderDraw(program: Program, uniforms: any, vao: VertexArrayObject): void {
    this.context.framebuffer = this;
    this.context.program = program;
    this.context.program.setUniformValues(uniforms);
    this.context.program.setUniformValues(uniforms);

    // draw
    this.context.gl.drawArrays(vao.primitive, vao.offset, vao.count);
  }

  renderPass(program: Program, uniforms: any): void {
    this.context.framebuffer = this;
    this.context.renderPass(program, uniforms); // just executes a pre-determined node and camera setup.
  }

  render(node: Node, camera: Camera, clear: boolean = false): void {
    this.context.framebuffer = this;
    if (clear) {
      this.clear();
    }
    this.context.render(node, camera);
  }

  readPixels(pixelBuffer: ArrayBufferView): ArrayBufferView {
    const attachment = this.attachments.find((attachment) => attachment.attachmentPoint === AttachmentPoints.Color0);
    if (!attachment) {
      throw new Error("can not find Color0 attachment");
    }

    const texImage2D = attachment.texImage2D;
    const dataType = texImage2D.dataType;
    const pixelFormat = texImage2D.pixelFormat;
    if (pixelFormat !== PixelFormat.RGBA) {
      throw new Error(`can not read non-RGBA color0 attachment: ${pixelFormat}`);
    }

    const oldFramebuffer = this.context.framebuffer;
    this.context.framebuffer = this;
    try {
      const status = this.context.gl.checkFramebufferStatus(GL.FRAMEBUFFER);
      if (status !== GL.FRAMEBUFFER_COMPLETE) {
        throw new Error(`can not read non-complete Framebuffer: ${status}`);
      }

      const pixelByteLength =
        sizeOfDataType(dataType) *
        numPixelFormatComponents(pixelFormat) *
        texImage2D.size.width *
        texImage2D.size.height;
      if (pixelBuffer.byteLength < pixelByteLength) {
        throw new Error(`pixelBuffer too small: ${pixelBuffer.byteLength} < ${pixelByteLength}`);
      }

      this.context.gl.readPixels(
        0,
        0,
        texImage2D.size.width,
        texImage2D.size.height,
        pixelFormat,
        dataType,
        pixelBuffer,
      );

      return pixelBuffer;
    } finally {
      this.context.framebuffer = oldFramebuffer;
    }
  }
}
