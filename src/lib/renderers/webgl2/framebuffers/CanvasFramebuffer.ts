//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { Camera } from "../../../nodes/cameras/Camera";
import { Node } from "../../../nodes/Node";
import { BufferGeometry } from "../buffers/BufferGeometry";
import { Program } from "../programs/Program";
import { RenderingContext } from "../RenderingContext";
import { VertexArrayObject } from "../VertexArrayObject";
import { VirtualFramebuffer } from "./VirtualFramebuffer";

export class CanvasFramebuffer extends VirtualFramebuffer {
  devicePixelRatio = 1.0;

  constructor(context: RenderingContext, public readonly canvas: HTMLCanvasElement) {
    super(context);
    // TODO: add listening to the canvas and resize the canvas width/height?
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose(): void {}

  renderVertexArrayObject(program: Program, uniforms: any, vao: VertexArrayObject): void {
    this.syncCanvas();
    super.renderVertexArrayObject(program, uniforms, vao);
  }

  renderBufferGeometry(program: Program, uniforms: any, bufferGeometry: BufferGeometry): void {
    this.syncCanvas();
    super.renderBufferGeometry(program, uniforms, bufferGeometry);
  }

  renderPass(program: Program, uniforms: any): void {
    this.syncCanvas();
    super.renderPass(program, uniforms);
  }

  render(node: Node, camera: Camera, clear = false): void {
    this.syncCanvas();
    super.render(node, camera, clear);
  }

  private syncCanvas(): void {
    // ...then set the internal size to match
    this.canvas.width = Math.round(this.canvas.offsetWidth / this.devicePixelRatio);
    this.canvas.height = Math.round(this.canvas.offsetHeight / this.devicePixelRatio);
  }
}
