//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { IDisposable } from "../../../core/types";
import { Box2 } from "../../../math/Box2";
import { Vector2 } from "../../../math/Vector2";
import { Camera } from "../../../nodes/cameras/Camera";
import { Node } from "../../../nodes/Node";
import { BlendState } from "../BlendState";
import { BufferGeometry } from "../buffers/BufferGeometry";
import { ClearState } from "../ClearState";
import { CullingState } from "../CullingState";
import { DepthTestState } from "../DepthTestState";
import { MaskState } from "../MaskState";
import { Program } from "../programs/Program";
import { UniformValueMap } from "../programs/ProgramUniform";
import { RenderingContext } from "../RenderingContext";
import { VertexArrayObject } from "../VertexArrayObject";
import { BufferBit } from "./BufferBit";

const GL = WebGLRenderingContext;

export abstract class VirtualFramebuffer implements IDisposable {
  disposed = false;
  public cullingState: CullingState | undefined = undefined;
  public clearState: ClearState | undefined = undefined;
  public depthTestState: DepthTestState | undefined = undefined;
  public blendState: BlendState | undefined = undefined;
  public maskState: MaskState | undefined = undefined;
  public viewport: Box2 | undefined = undefined;

  constructor(public context: RenderingContext) {}

  abstract get size(): Vector2;

  clear(
    attachmentBits: BufferBit = BufferBit.Color | BufferBit.Depth,
    clearState: ClearState | undefined = undefined,
  ): void {
    // eslint-disable-next-line cflint/no-this-assignment
    this.context.framebuffer = this;
    this.context.clearState = clearState ?? this.clearState ?? this.context.clearState;
    const gl = this.context.gl;
    gl.clear(attachmentBits);
  }

  renderBufferGeometry(
    program: Program,
    uniforms: UniformValueMap,
    bufferGeometry: BufferGeometry,
    depthTestState: DepthTestState | undefined = undefined,
    blendState: BlendState | undefined = undefined,
    maskState: MaskState | undefined = undefined,
    cullingState: CullingState | undefined = undefined,
  ): void {
    // eslint-disable-next-line cflint/no-this-assignment
    this.context.framebuffer = this;
    this.context.blendState = blendState ?? this.blendState ?? this.context.blendState;
    this.context.depthTestState = depthTestState ?? this.depthTestState ?? this.context.depthTestState;
    this.context.maskState = maskState ?? this.maskState ?? this.context.maskState;
    this.context.cullingState = cullingState ?? this.cullingState ?? this.context.cullingState;
    this.context.program = program;
    this.context.program.setUniformValues(uniforms);
    this.context.program.setAttributeBuffers(bufferGeometry);

    // draw
    const gl = this.context.gl;
    this.context.viewport = new Box2(new Vector2(), this.size);
    if (bufferGeometry.indices !== undefined) {
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
    cullingState: CullingState | undefined = undefined,
  ): void {
    // eslint-disable-next-line cflint/no-this-assignment
    this.context.framebuffer = this;
    this.context.blendState = blendState ?? this.blendState ?? this.context.blendState;
    this.context.depthTestState = depthTestState ?? this.depthTestState ?? this.context.depthTestState;
    this.context.maskState = maskState ?? this.maskState ?? this.context.maskState;
    this.context.cullingState = cullingState ?? this.cullingState ?? this.context.cullingState;
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
    cullingState: CullingState | undefined = undefined,
  ): void {
    // eslint-disable-next-line cflint/no-this-assignment
    this.context.framebuffer = this;
    this.context.blendState = blendState ?? this.blendState ?? this.context.blendState;
    this.context.depthTestState = depthTestState ?? this.depthTestState ?? this.context.depthTestState;
    this.context.maskState = maskState ?? this.maskState ?? this.context.maskState;
    this.context.cullingState = cullingState ?? this.cullingState ?? this.context.cullingState;
    this.context.renderPass(program, uniforms); // just executes a pre-determined node and camera setup.
  }

  render(node: Node, camera: Camera, clear = false): void {
    // eslint-disable-next-line cflint/no-this-assignment
    this.context.framebuffer = this;
    if (clear) {
      this.clear();
    }
    this.context.render(node, camera);
  }

  abstract dispose(): void;
}
