//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { PixelFormat, numPixelFormatComponents } from "../../textures/PixelFormat";
import { Color } from "../../math/Color";
import { IDisposable } from "../../core/types";
import { Program } from "./Program";
import { ProgramUniform } from "./ProgramUniform";
import { RenderingContext } from "./RenderingContext";
import { TexImage2D } from "./TexImage2D";
import { VertexArrayObject } from "./VertexArrayObject";
import { sizeOfDataType } from "../../textures/DataType";
import { ClearState } from "./ClearState";
import { Camera } from "../../nodes/cameras/Camera";
import { Group } from "../../nodes/Group";
import { Framebuffer } from "./Framebuffer";

const GL = WebGLRenderingContext;

export class CanvasFramebuffer extends Framebuffer {
  readonly canvas: HTMLCanvasElement;
  devicePixelRatio = 1.0;

  constructor(context: RenderingContext, canvas: HTMLCanvasElement) {
    super(context);
    this.canvas = canvas;
    // TODO: add listening to the canvas and resize the canvas width/height?
  }

  private syncCanvas() {
    // ...then set the internal size to match
    this.canvas.width = Math.round(this.canvas.offsetWidth / this.devicePixelRatio);
    this.canvas.height = Math.round(this.canvas.offsetHeight / this.devicePixelRatio);
  }

  renderDraw(program: Program, uniforms: any, vao: VertexArrayObject): void {
    this.syncCanvas();
    super.renderDraw(program, uniforms, vao);
  }

  renderPass(program: Program, uniforms: any): void {
    this.syncCanvas();
    super.renderPass(program, uniforms);
  }

  render(node: Group, camera: Camera, clear: boolean = false): void {
    this.syncCanvas();
    super.render(node, camera, clear);
  }
}
