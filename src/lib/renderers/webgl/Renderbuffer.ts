import { generateUUID } from '../../core/generateUuid.js';
import { ClearState } from './ClearState.js';
import { IResource } from './IResource.js';
import { RenderingContext } from './RenderingContext.js';

export class Renderbuffer implements IResource {
  public readonly id = generateUUID();
  disposed = false;
  glRenderbuffer: WebGLRenderbuffer;
  #clearState: ClearState = new ClearState();

  constructor(public context: RenderingContext) {
    const { gl, resources } = this.context;

    {
      const glRenderbuffer = gl.createRenderbuffer();
      if (glRenderbuffer === null) {
        throw new Error('createRenderbuffer failed');
      }

      this.glRenderbuffer = glRenderbuffer;
    }

    resources.register(this);
  }

  dispose(): void {
    if (!this.disposed) {
      const { gl, resources } = this.context;
      gl.deleteRenderbuffer(this.glRenderbuffer);
      resources.unregister(this);
      this.disposed = true;
    }
  }
}
