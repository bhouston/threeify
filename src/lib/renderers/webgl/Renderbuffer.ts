import { IDisposable } from '../../core/types.js';
import { ClearState } from './ClearState.js';
import { RenderingContext } from './RenderingContext.js';

export class Renderbuffer implements IDisposable {
  readonly id: number;
  disposed = false;
  glRenderbuffer: WebGLRenderbuffer;
  #clearState: ClearState = new ClearState();

  constructor(public context: RenderingContext) {
    const { gl } = this.context;

    {
      const glRenderbuffer = gl.createRenderbuffer();
      if (glRenderbuffer === null) {
        throw new Error('createRenderbuffer failed');
      }

      this.glRenderbuffer = glRenderbuffer;
    }

    this.id = this.context.registerResource(this);
  }

  dispose(): void {
    if (!this.disposed) {
      const { gl } = this.context;
      gl.deleteRenderbuffer(this.glRenderbuffer);
      this.context.disposeResource(this);
      this.disposed = true;
    }
  }
}
