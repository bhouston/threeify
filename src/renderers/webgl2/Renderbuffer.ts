import { IDisposable } from "../../types/types";
import { RenderingContext } from "./RenderingContext";
import { ClearState } from "./ClearState";

export class Renderbuffer implements IDisposable {
  disposed = false;
  context: RenderingContext;
  glRenderbuffer: WebGLRenderbuffer;
  private _clearState: ClearState = new ClearState();

  constructor(context: RenderingContext) {
    this.context = context;

    const gl = this.context.gl;

    {
      const glRenderbuffer = gl.createRenderbuffer();
      if (!glRenderbuffer) {
        throw new Error("createRenderbuffer failed");
      }

      this.glRenderbuffer = glRenderbuffer;
    }
  }

  dispose(): void {
    if (!this.disposed) {
      const gl = this.context.gl;
      gl.deleteRenderbuffer(this.glRenderbuffer);
      this.disposed = true;
    }
  }
}
