//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { Camera } from "../../nodes/cameras/Camera";
import { Framebuffer } from "./Framebuffer";
import { Node } from "../../nodes/Node";
import { Program } from "./Program";
import { RenderingContext } from "./RenderingContext";
import { VertexArrayObject } from "./VertexArrayObject";

const GL = WebGLRenderingContext;

export class CanvasFramebuffer extends Framebuffer {
  readonly canvas: HTMLCanvasElement;
  devicePixelRatio = 1.0;

  constructor(context: RenderingContext, canvas: HTMLCanvasElement) {
    super(context);
    this.canvas = canvas;
    // TODO: add listening to the canvas and resize the canvas width/height?
  }

  renderDraw(program: Program, uniforms: any, vao: VertexArrayObject): void {
    this.syncCanvas();
    super.renderDraw(program, uniforms, vao);
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
