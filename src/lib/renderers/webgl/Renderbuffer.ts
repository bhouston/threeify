import { IDisposable } from "../../core/types";
import { ClearState } from "./ClearState";
import { RenderingContext } from "./RenderingContext";

export class Renderbuffer implements IDisposable {
  disposed = false;
  glRenderbuffer: WebGLRenderbuffer;
  #clearState: ClearState = new ClearState();

  constructor(public context: RenderingContext) {
    const gl = this.context.gl;

    {
      const glRenderbuffer = gl.createRenderbuffer();
      if (glRenderbuffer === null) {
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
