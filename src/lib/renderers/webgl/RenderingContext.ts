//
// basic context
//
// Authors:
// * @bhouston
//

import { Box2 } from '../../math/Box2.js';
import { BlendState } from './BlendState.js';
import { Buffer } from './buffers/Buffer.js';
import { ClearState } from './ClearState.js';
import { CullingState } from './CullingState.js';
import { DepthTestState } from './DepthTestState.js';
import { Extensions } from './extensions/Extensions.js';
import { OptionalExtensions } from './extensions/OptionalExtensions.js';
import { CanvasFramebuffer } from './framebuffers/CanvasFramebuffer.js';
import { Framebuffer } from './framebuffers/Framebuffer.js';
import { VirtualFramebuffer } from './framebuffers/VirtualFramebuffer.js';
import { GL } from './GL.js';
import { MaskState } from './MaskState.js';
import { getParameterAsString } from './Parameters.js';
import { Program } from './programs/Program.js';
import { Renderbuffer } from './Renderbuffer.js';
import { Shader } from './shaders/Shader.js';
import { TexImage2D } from './textures/TexImage2D.js';
import { VertexArrayObject } from './VertexArrayObject.js';

export type Resource =
  | VertexArrayObject
  | TexImage2D
  | Program
  | Shader
  | Framebuffer
  | Buffer
  | Renderbuffer;
export type ResourceMap = { [id: number]: Resource };

export class RenderingContext {
  readonly gl: WebGL2RenderingContext;
  readonly glx: Extensions;
  readonly glxo: OptionalExtensions;
  readonly canvasFramebuffer: CanvasFramebuffer;
  readonly resources: ResourceMap = {};
  nextResourceId = 0;

  #program: Program | undefined = undefined;
  #framebuffer: VirtualFramebuffer;
  #scissor: Box2 = new Box2();
  #viewport: Box2 = new Box2();
  #depthTestState: DepthTestState = new DepthTestState();
  #blendState: BlendState = new BlendState();
  #clearState: ClearState = new ClearState();
  #maskState: MaskState = new MaskState();
  #cullingState: CullingState = new CullingState();

  constructor(
    public canvas: HTMLCanvasElement,
    attributes: WebGLContextAttributes | undefined = undefined
  ) {
    if (attributes === undefined) {
      attributes = {};
      attributes.alpha = true;
      attributes.antialias = true;
      attributes.depth = true;
      attributes.premultipliedAlpha = true;
      attributes.stencil = true;
    }
    {
      const gl = canvas.getContext('webgl2', attributes);
      if (gl === null) {
        throw new Error('webgl2 not supported');
      }
      this.gl = gl;
    }
    this.glx = new Extensions(this.gl);
    this.glxo = new OptionalExtensions(this.gl);

    this.canvasFramebuffer = new CanvasFramebuffer(this);
    this.#framebuffer = this.canvasFramebuffer;
  }

  registerResource(resource: Resource): number {
    const id = this.nextResourceId++;
    this.resources[id] = resource;
    return id;
  }

  disposeResource(resource: Resource): void {
    delete this.resources[resource.id];
  }

  get debugVendor(): string {
    // Note: this is a big performance hit to call, this only return if asked
    const dri = this.glxo.WEBGL_debug_renderer_info;
    return dri !== null
      ? getParameterAsString(this.gl, dri.UNMASKED_VENDOR_WEBGL)
      : '';
  }

  get debugRenderer(): string {
    // Note: this is a big performance hit to call, this only return if asked
    const dri = this.glxo.WEBGL_debug_renderer_info;
    return dri !== null
      ? getParameterAsString(this.gl, dri.UNMASKED_RENDERER_WEBGL)
      : '';
  }

  set program(program: Program | undefined) {
    if (this.#program !== program) {
      if (program !== undefined) {
        program.validate();
        this.gl.useProgram(program.glProgram);
      } else {
        this.gl.useProgram(null);
      }
      this.#program = program;
    }
  }

  get program(): Program | undefined {
    return this.#program;
  }

  set framebuffer(framebuffer: VirtualFramebuffer) {
    if (this.#framebuffer !== framebuffer) {
      if (framebuffer instanceof CanvasFramebuffer) {
        this.gl.bindFramebuffer(GL.FRAMEBUFFER, null);
      } else if (framebuffer instanceof Framebuffer) {
        this.gl.bindFramebuffer(GL.FRAMEBUFFER, framebuffer.glFramebuffer);
      }
      this.#framebuffer = framebuffer;
    }
  }

  get framebuffer(): VirtualFramebuffer {
    return this.#framebuffer;
  }

  //
  get scissor(): Box2 {
    return this.#scissor.clone();
  }

  set scissor(s: Box2) {
    this.gl.scissor(s.x, s.y, s.width, s.height);
  }

  // specifies the affine transformation of x and y from normalized device coordinates to window coordinates.
  get viewport(): Box2 {
    return this.#viewport.clone();
  }

  set viewport(v: Box2) {
    this.gl.viewport(v.x, v.y, v.width, v.height);
  }

  get blendState(): BlendState {
    return this.#blendState.clone();
  }

  set blendState(bs: BlendState) {
    this.gl.enable(GL.BLEND);
    this.gl.blendEquation(bs.equation);
    this.gl.blendFuncSeparate(
      bs.sourceRGBFactor,
      bs.destRGBFactor,
      bs.sourceAlphaFactor,
      bs.destAlphaFactor
    );
    /* console.log(
        `Blend ${BlendEquation[bs.equation]} srcRGB ${BlendFunc[bs.sourceRGBFactor]} destRGB ${
          BlendFunc[bs.destRGBFactor]
        } srcA ${BlendFunc[bs.sourceAlphaFactor]} destA ${BlendFunc[bs.destAlphaFactor]}`,
      ); */
    this.#blendState.copy(bs);
  }

  get depthTestState(): DepthTestState {
    return this.#depthTestState.clone();
  }

  set depthTestState(dts: DepthTestState) {
    if (dts.enabled) {
      this.gl.enable(GL.DEPTH_TEST);
    } else {
      this.gl.disable(GL.DEPTH_TEST);
    }
    this.gl.depthFunc(dts.func);
    this.#depthTestState.copy(dts);
  }

  get clearState(): ClearState {
    return this.#clearState.clone();
  }

  set clearState(cs: ClearState) {
    this.gl.clearColor(cs.color.r, cs.color.g, cs.color.b, cs.alpha);
    this.gl.clearDepth(cs.depth);
    this.gl.clearStencil(cs.stencil);
    this.#clearState.copy(cs);
  }

  get maskState(): MaskState {
    return this.#maskState.clone();
  }

  set maskState(ms: MaskState) {
    this.gl.colorMask(ms.red, ms.green, ms.blue, ms.alpha);
    this.gl.depthMask(ms.depth);
    this.gl.stencilMask(ms.stencil);
    this.#maskState.copy(ms);
  }

  get cullingState(): CullingState {
    return this.#cullingState.clone();
  }

  set cullingState(cs: CullingState) {
    if (cs.enabled) {
      this.gl.enable(GL.CULL_FACE);
    } else {
      this.gl.disable(GL.CULL_FACE);
    }
    this.gl.frontFace(cs.windingOrder);
    this.gl.cullFace(cs.sides);
    this.#cullingState.copy(cs);
  }
}
