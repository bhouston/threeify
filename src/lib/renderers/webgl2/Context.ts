
export class Context {

  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;

  constructor(canvas: HTMLCanvasElement) {

    this.canvas = canvas;
    {
      let gl = canvas.getContext("webgl2");
      if (!gl) {
        throw new Error("webgl2 not supported");
      }
      this.gl = gl;
    }

  }

}
