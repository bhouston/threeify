//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { Vec2 } from '../../../math/Vec2.js';
import { RenderingContext } from '../RenderingContext.js';
import { VirtualFramebuffer } from './VirtualFramebuffer.js';

export class CanvasFramebuffer extends VirtualFramebuffer {
  public readonly canvas: HTMLCanvasElement | OffscreenCanvas;
  public autoLayoutMode = true;
  public devicePixelRatio = 1;

  constructor(context: RenderingContext) {
    super(context);
    this.canvas = context.gl.canvas;
    if (window !== undefined) {
      this.devicePixelRatio = window.devicePixelRatio;
    }
    console.log(this.devicePixelRatio);
    this.resize();
  }

  /**
   * Synchronizes the render resolution of the canvas to that of its visible dimensions
   * taking into account the device pixel ratio.
   */
  resize(): void {
    const { canvas, devicePixelRatio } = this;
    if (canvas instanceof HTMLCanvasElement) {
      const width = Math.floor(canvas.clientWidth * devicePixelRatio);
      const height = Math.floor(canvas.clientHeight * devicePixelRatio);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    }
  }

  get size(): Vec2 {
    return new Vec2(
      this.context.gl.drawingBufferWidth,
      this.context.gl.drawingBufferHeight
    );
  }

  get aspectRatio(): number {
    return (
      this.context.gl.drawingBufferWidth / this.context.gl.drawingBufferHeight
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose(): void {}
}
