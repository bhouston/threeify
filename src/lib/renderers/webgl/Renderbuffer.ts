import { IDisposable } from "../../core/types";
import { ClearState } from "./ClearState";
import { RenderingContext } from "./RenderingContext";

export class Renderbuffer implements IDisposable {
  readonly id: number;
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

    this.id = this.context.registerResource(this);
  }

  dispose(): void {
    if (!this.disposed) {
      const gl = this.context.gl;
      gl.deleteRenderbuffer(this.glRenderbuffer);
      this.context.disposeResource(this);
      this.disposed = true;
    }
  }
}
