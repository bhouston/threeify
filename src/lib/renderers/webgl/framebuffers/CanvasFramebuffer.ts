//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { Vector2 } from "../../../math/Vector2";
import { Camera } from "../../../nodes/cameras/Camera";
import { Node } from "../../../nodes/Node";
import { BlendState } from "../BlendState";
import { BufferGeometry } from "../buffers/BufferGeometry";
import { DepthTestState } from "../DepthTestState";
import { MaskState } from "../MaskState";
import { Program } from "../programs/Program";
import { UniformValueMap } from "../programs/ProgramUniform";
import { RenderingContext } from "../RenderingContext";
import { VertexArrayObject } from "../VertexArrayObject";
import { VirtualFramebuffer } from "./VirtualFramebuffer";

export class CanvasFramebuffer extends VirtualFramebuffer {
  public readonly canvas: HTMLCanvasElement | OffscreenCanvas;
  devicePixelRatio = 1.0;

  constructor(context: RenderingContext) {
    super(context);
    this.canvas = context.gl.canvas;
  }

  get size(): Vector2 {
    return new Vector2(this.context.gl.drawingBufferWidth, this.context.gl.drawingBufferHeight);
  }

  get aspectRatio(): number {
    return this.context.gl.drawingBufferWidth / this.context.gl.drawingBufferHeight;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose(): void {}

  renderVertexArrayObject(
    program: Program,
    uniforms: UniformValueMap,
    vao: VertexArrayObject,
    depthTestState: DepthTestState | undefined = undefined,
    blendState: BlendState | undefined = undefined,
    maskState: MaskState | undefined = undefined,
  ): void {
    super.renderVertexArrayObject(program, uniforms, vao, depthTestState, blendState, maskState);
  }

  renderBufferGeometry(
    program: Program,
    uniforms: UniformValueMap,
    bufferGeometry: BufferGeometry,
    depthTestState: DepthTestState | undefined = undefined,
    blendState: BlendState | undefined = undefined,
    maskState: MaskState | undefined = undefined,
  ): void {
    super.renderBufferGeometry(program, uniforms, bufferGeometry, depthTestState, blendState, maskState);
  }

  renderPass(
    program: Program,
    uniforms: UniformValueMap,
    depthTestState: DepthTestState | undefined = undefined,
    blendState: BlendState | undefined = undefined,
    maskState: MaskState | undefined = undefined,
  ): void {
    super.renderPass(program, uniforms, depthTestState, blendState, maskState);
  }

  render(node: Node, camera: Camera, clear = false): void {
    super.render(node, camera, clear);
  }
}
