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

  render(node: Node, camera: Camera, clear = false): void {
    // eslint-disable-next-line cflint/no-this-assignment
    this.context.framebuffer = this;
    if (clear) {
      this.clear();
    }
    throw new Error("Not implemented");
    //    this.context.render(node, camera);
  }

  flush(): void {
    this.context.gl.flush();
  }

  finish(): void {
    this.context.gl.finish();
  }

  abstract dispose(): void;
}

export function renderBufferGeometry(
  framebuffer: VirtualFramebuffer,
  program: Program,
  uniforms: UniformValueMap,
  bufferGeometry: BufferGeometry,
  depthTestState: DepthTestState | undefined = undefined,
  blendState: BlendState | undefined = undefined,
  maskState: MaskState | undefined = undefined,
  cullingState: CullingState | undefined = undefined,
): void {
  const context = framebuffer.context;

  context.framebuffer = framebuffer;
  context.blendState = blendState ?? framebuffer.blendState ?? context.blendState;
  context.depthTestState = depthTestState ?? framebuffer.depthTestState ?? context.depthTestState;
  context.maskState = maskState ?? framebuffer.maskState ?? context.maskState;
  context.cullingState = cullingState ?? framebuffer.cullingState ?? context.cullingState;
  context.program = program;
  context.program.setUniformValues(uniforms);
  context.program.setAttributeBuffers(bufferGeometry);
  context.viewport = new Box2(new Vector2(), framebuffer.size);

  // draw
  const gl = context.gl;
  if (bufferGeometry.indices !== undefined) {
    gl.drawElements(bufferGeometry.primitive, bufferGeometry.count, bufferGeometry.indices.componentType, 0);
  } else {
    gl.drawArrays(bufferGeometry.primitive, 0, bufferGeometry.count);
  }
}

export function renderVertexArrayObject(
  framebuffer: VirtualFramebuffer,
  program: Program,
  uniforms: UniformValueMap,
  vao: VertexArrayObject,
  depthTestState: DepthTestState | undefined = undefined,
  blendState: BlendState | undefined = undefined,
  maskState: MaskState | undefined = undefined,
  cullingState: CullingState | undefined = undefined,
): void {
  const context = framebuffer.context;

  context.framebuffer = framebuffer;
  context.blendState = blendState ?? framebuffer.blendState ?? context.blendState;
  context.depthTestState = depthTestState ?? framebuffer.depthTestState ?? context.depthTestState;
  context.maskState = maskState ?? framebuffer.maskState ?? context.maskState;
  context.cullingState = cullingState ?? framebuffer.cullingState ?? context.cullingState;
  context.program = program;
  context.program.setUniformValues(uniforms);
  context.viewport = new Box2(new Vector2(), framebuffer.size);

  // draw
  const gl = context.gl;
  gl.drawArrays(vao.primitive, vao.offset, vao.count);
}

export function renderPass(
  framebuffer: VirtualFramebuffer,
  program: Program,
  uniforms: UniformValueMap,
  depthTestState: DepthTestState | undefined = undefined,
  blendState: BlendState | undefined = undefined,
  maskState: MaskState | undefined = undefined,
  cullingState: CullingState | undefined = undefined,
): void {
  const context = framebuffer.context;

  context.framebuffer = framebuffer;
  context.blendState = blendState ?? framebuffer.blendState ?? context.blendState;
  context.depthTestState = depthTestState ?? framebuffer.depthTestState ?? context.depthTestState;
  context.maskState = maskState ?? framebuffer.maskState ?? context.maskState;
  context.cullingState = cullingState ?? framebuffer.cullingState ?? context.cullingState;
  context.program = program;
  context.program.setUniformValues(uniforms);
  context.viewport = new Box2(new Vector2(), framebuffer.size);

  // context.renderPass(program, uniforms); // just executes a pre-determined node and camera setup.
}
