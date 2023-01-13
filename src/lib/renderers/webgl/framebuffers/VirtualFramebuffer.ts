//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { IDisposable } from '../../../core/types.js';
import { Box2 } from '../../../math/Box2.js';
import { Vec2 } from '../../../math/Vec2.js';
import { Camera } from '../../../scene/cameras/Camera.js';
import { SceneNode } from '../../../scene/SceneNode.js';
import { BlendState } from '../BlendState.js';
import { BufferGeometry } from '../buffers/BufferGeometry.js';
import { ClearState } from '../ClearState.js';
import { CullingState } from '../CullingState.js';
import { DepthTestState } from '../DepthTestState.js';
import { MaskState } from '../MaskState.js';
import { Program } from '../programs/Program.js';
import { UniformValueMap } from '../programs/ProgramUniform.js';
import { RenderingContext } from '../RenderingContext.js';
import { VertexArrayObject } from '../VertexArrayObject.js';
import { BufferBit } from './BufferBit.js';

const GL = WebGL2RenderingContext;

export abstract class VirtualFramebuffer implements IDisposable {
  disposed = false;
  public cullingState: CullingState | undefined = undefined;
  public clearState: ClearState | undefined = undefined;
  public depthTestState: DepthTestState | undefined = undefined;
  public blendState: BlendState | undefined = undefined;
  public maskState: MaskState | undefined = undefined;
  public viewport: Box2 | undefined = undefined;

  constructor(public context: RenderingContext) {}

  abstract get size(): Vec2;

  clear(
    attachmentBits: BufferBit = BufferBit.Color | BufferBit.Depth,
    clearState: ClearState | undefined = undefined
  ): void {
    this.context.framebuffer = this;
    this.context.clearState =
      clearState ?? this.clearState ?? this.context.clearState;
    const { gl } = this.context;
    gl.clear(attachmentBits);
  }

  render(node: SceneNode, camera: Camera, clear = false): void {
    this.context.framebuffer = this;
    if (clear) {
      this.clear();
    }
    throw new Error('Not implemented');
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
  cullingState: CullingState | undefined = undefined
): void {
  const { context } = framebuffer;

  context.framebuffer = framebuffer;
  context.blendState =
    blendState ?? framebuffer.blendState ?? context.blendState;
  context.depthTestState =
    depthTestState ?? framebuffer.depthTestState ?? context.depthTestState;
  context.maskState = maskState ?? framebuffer.maskState ?? context.maskState;
  context.cullingState =
    cullingState ?? framebuffer.cullingState ?? context.cullingState;
  context.program = program;
  context.program.setUniformValues(uniforms);
  context.program.setAttributeBuffers(bufferGeometry);
  context.viewport = new Box2(new Vec2(), framebuffer.size);

  // draw
  const { gl } = context;
  if (bufferGeometry.indices !== undefined) {
    gl.drawElements(
      bufferGeometry.primitive,
      bufferGeometry.count,
      bufferGeometry.indices.componentType,
      0
    );
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
  cullingState: CullingState | undefined = undefined
): void {
  const { context } = framebuffer;

  context.framebuffer = framebuffer;
  context.blendState =
    blendState ?? framebuffer.blendState ?? context.blendState;
  context.depthTestState =
    depthTestState ?? framebuffer.depthTestState ?? context.depthTestState;
  context.maskState = maskState ?? framebuffer.maskState ?? context.maskState;
  context.cullingState =
    cullingState ?? framebuffer.cullingState ?? context.cullingState;
  context.program = program;
  context.program.setUniformValues(uniforms);
  context.viewport = new Box2(new Vec2(), framebuffer.size);

  // draw
  const { gl } = context;
  gl.drawArrays(vao.primitive, vao.offset, vao.count);
}

export function renderPass(
  framebuffer: VirtualFramebuffer,
  program: Program,
  uniforms: UniformValueMap,
  depthTestState: DepthTestState | undefined = undefined,
  blendState: BlendState | undefined = undefined,
  maskState: MaskState | undefined = undefined,
  cullingState: CullingState | undefined = undefined
): void {
  const { context } = framebuffer;

  context.framebuffer = framebuffer;
  context.blendState =
    blendState ?? framebuffer.blendState ?? context.blendState;
  context.depthTestState =
    depthTestState ?? framebuffer.depthTestState ?? context.depthTestState;
  context.maskState = maskState ?? framebuffer.maskState ?? context.maskState;
  context.cullingState =
    cullingState ?? framebuffer.cullingState ?? context.cullingState;
  context.program = program;
  context.program.setUniformValues(uniforms);
  context.viewport = new Box2(new Vec2(), framebuffer.size);

  throw new Error('Not implemented');
  // context.renderPass(program, uniforms); // just executes a pre-determined node and camera setup.
}
