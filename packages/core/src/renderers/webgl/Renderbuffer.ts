import { Vec2 } from '@threeify/math';

import { generateUUID } from '../../core/generateUuid.js';
import { ClearState } from './ClearState.js';
import { IResource } from './IResource.js';
import { RenderingContext } from './RenderingContext.js';
import { InternalFormat } from './textures/InternalFormat.js';

export class Renderbuffer implements IResource {
  public readonly id = generateUUID();
  disposed = false;
  glRenderbuffer: WebGLRenderbuffer;
  #clearState: ClearState = new ClearState();

  constructor(
    public context: RenderingContext,
    public samples = 2,
    public internalFormat = InternalFormat.RGBA8,
    public size = new Vec2(1024, 1024)
  ) {
    const { gl, resources } = this.context;

    {
      const glRenderbuffer = gl.createRenderbuffer();
      if (glRenderbuffer === null) {
        throw new Error('createRenderbuffer failed');
      }

      if (samples > 1) {
        gl.renderbufferStorageMultisample(
          gl.RENDERBUFFER,
          this.samples,
          this.internalFormat,
          this.size.x,
          this.size.y
        );
      } else {
        gl.renderbufferStorage(
          gl.RENDERBUFFER,
          this.internalFormat,
          this.size.x,
          this.size.y
        );
      }

      this.glRenderbuffer = glRenderbuffer;
    }

    resources.register(this);
  }

  dispose(): void {
    if (this.disposed) return;

    const { gl, resources } = this.context;
    gl.deleteRenderbuffer(this.glRenderbuffer);
    resources.unregister(this);
    this.disposed = true;
  }
}
