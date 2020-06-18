//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { IDisposable } from "../../../core/types";
import { Camera } from "../../../nodes/cameras/Camera";
import { Node } from "../../../nodes/Node";
import { BlendState } from "../BlendState";
import { BufferGeometry } from "../buffers/BufferGeometry";
import { ClearState } from "../ClearState";
import { DepthTestState } from "../DepthTestState";
import { MaskState } from "../MaskState";
import { Program } from "../programs/Program";
import { UniformValueMap } from "../programs/ProgramUniform";
import { RenderingContext } from "../RenderingContext";
import { sizeOfDataType } from "../textures/DataType";
import { numPixelFormatComponents, PixelFormat } from "../textures/PixelFormat";
import { TexImage2D } from "../textures/TexImage2D";
import { VertexArrayObject } from "../VertexArrayObject";
import { AttachmentPoints } from "./AttachmentPoints";
import { Attachments } from "./Attachments";

const GL = WebGLRenderingContext;

export class FramebufferAttachment {
  constructor(public attachmentPoint: number, public texImage2D: TexImage2D) {}
}

export abstract class VirtualFramebuffer implements IDisposable {
  disposed = false;
  public clearState: ClearState | undefined = undefined;
  public depthTestState: DepthTestState | undefined = undefined;
  public blendState: BlendState | undefined = undefined;
  public maskState: MaskState | undefined = undefined;

  constructor(public context: RenderingContext, public attachments: Array<FramebufferAttachment> = []) {}

  clear(
    attachmentFlags: Attachments = Attachments.Color | Attachments.Depth,
    clearState: ClearState | undefined = undefined,
  ): void {
    this.context.framebuffer = this;
    this.context.clearState = clearState ?? this.clearState ?? this.context.clearState;
    const gl = this.context.gl;
    gl.clear(attachmentFlags);
  }

  renderBufferGeometry(
    program: Program,
    uniforms: UniformValueMap,
    bufferGeometry: BufferGeometry,
    depthTestState: DepthTestState | undefined = undefined,
    blendState: BlendState | undefined = undefined,
    maskState: MaskState | undefined = undefined,
  ): void {
    this.context.framebuffer = this;
    this.context.blendState = blendState ?? this.blendState ?? this.context.blendState;
    this.context.depthTestState = depthTestState ?? this.depthTestState ?? this.context.depthTestState;
    this.context.maskState = maskState ?? this.maskState ?? this.context.maskState;
    this.context.program = program;
    this.context.program.setUniformValues(uniforms);
    this.context.program.setAttributeBuffers(bufferGeometry);

    // draw
    const gl = this.context.gl;
    if (bufferGeometry.indices !== undefined) {
      // console.log(
      //  `gl.drawElements(${bufferGeometry.primitive}, ${bufferGeometry.count}, ${bufferGeometry.indices.componentType}//, 0)`,
      // );
      gl.drawElements(bufferGeometry.primitive, bufferGeometry.count, bufferGeometry.indices.componentType, 0);
    } else {
      gl.drawArrays(bufferGeometry.primitive, 0, bufferGeometry.count);
    }
  }

  renderVertexArrayObject(
    program: Program,
    uniforms: UniformValueMap,
    vao: VertexArrayObject,
    depthTestState: DepthTestState | undefined = undefined,
    blendState: BlendState | undefined = undefined,
    maskState: MaskState | undefined = undefined,
  ): void {
    this.context.framebuffer = this;
    this.context.blendState = blendState ?? this.blendState ?? this.context.blendState;
    this.context.depthTestState = depthTestState ?? this.depthTestState ?? this.context.depthTestState;
    this.context.maskState = maskState ?? this.maskState ?? this.context.maskState;
    this.context.program = program;
    this.context.program.setUniformValues(uniforms);
    this.context.program.setAttributeBuffers(vao);

    // draw
    const gl = this.context.gl;
    gl.drawArrays(vao.primitive, vao.offset, vao.count);
  }

  renderPass(
    program: Program,
    uniforms: UniformValueMap,
    depthTestState: DepthTestState | undefined = undefined,
    blendState: BlendState | undefined = undefined,
    maskState: MaskState | undefined = undefined,
  ): void {
    this.context.framebuffer = this;
    this.context.blendState = blendState ?? this.blendState ?? this.context.blendState;
    this.context.depthTestState = depthTestState ?? this.depthTestState ?? this.context.depthTestState;
    this.context.maskState = maskState ?? this.maskState ?? this.context.maskState;
    this.context.renderPass(program, uniforms); // just executes a pre-determined node and camera setup.
  }

  render(node: Node, camera: Camera, clear = false): void {
    this.context.framebuffer = this;
    if (clear) {
      this.clear();
    }
    this.context.render(node, camera);
  }

  readPixels(pixelBuffer: ArrayBufferView): ArrayBufferView {
    const attachment = this.attachments.find((attachment) => attachment.attachmentPoint === AttachmentPoints.Color0);
    if (attachment === undefined) {
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

  abstract dispose(): void;
}
