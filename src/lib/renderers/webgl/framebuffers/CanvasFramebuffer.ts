//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { Vector2 } from '../../../math/Vector2';
import { RenderingContext } from '../RenderingContext';
import { VirtualFramebuffer } from './VirtualFramebuffer';

export class CanvasFramebuffer extends VirtualFramebuffer {
  public readonly canvas: HTMLCanvasElement | OffscreenCanvas;
  public autoLayoutMode = true;
  public devicePixelRatio = 1.0;

  constructor(context: RenderingContext) {
    super(context);
    this.canvas = context.gl.canvas;
    this.resize();
  }

  /**
   * Synchronizes the render resolution of the canvas to that of its visible dimensions
   * taking into account the device pixel ratio.
   */
  resize(): void {
    const { canvas } = this;
    if (canvas instanceof HTMLCanvasElement) {
      const width = Math.floor(canvas.clientWidth * this.devicePixelRatio);
      const height = Math.floor(canvas.clientHeight * this.devicePixelRatio);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    }
  }

  get size(): Vector2 {
    return new Vector2(
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
