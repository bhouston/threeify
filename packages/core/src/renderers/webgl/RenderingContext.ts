//
// basic context
//
// Authors:
// * @bhouston
//

import { Box2 } from '@threeify/vector-math';

import { BlendState } from './BlendState.js';
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
import { Resources } from './Resources.js';

export class RenderingContext {
  public readonly gl: WebGL2RenderingContext;
  readonly glx: Extensions;
  readonly glxo: OptionalExtensions;
  readonly canvasFramebuffer: CanvasFramebuffer;
  public readonly resources: Resources;

  #program: Program | undefined = undefined;
  #framebuffer: VirtualFramebuffer;
  #scissor: Box2 = new Box2();
  #viewport: Box2 = new Box2();
  #depthTestState: DepthTestState = new DepthTestState();
  #blendState: BlendState = new BlendState();
  #clearState: ClearState = new ClearState();
  #maskState: MaskState = new MaskState();
  #cullingState: CullingState = new CullingState();
  initialMode = true;

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

    this.resources = new Resources(this);

    this.canvasFramebuffer = new CanvasFramebuffer(this);
    this.#framebuffer = this.canvasFramebuffer;
    this.depthTestState = this.#depthTestState;
    this.cullingState = this.#cullingState;
    this.clearState = this.#clearState;
    this.blendState = this.#blendState;
    this.maskState = this.#maskState;

    this.initialMode = false;
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
    // setting the viewport even if it is already set is required in a number of cases, such as render to texture
    // the following line will cause a bug if commented out.  --Ben 2023-02-01
    //if (this.#program !== program) {
    if (program !== undefined) {
      program.isReady();
      this.gl.useProgram(program.glProgram);
    } else {
      this.gl.useProgram(null);
    }
    this.#program = program;
    //}
  }

  get program(): Program | undefined {
    return this.#program;
  }

  set framebuffer(framebuffer: VirtualFramebuffer) {
    // setting the viewport even if it is already set is required in a number of cases, such as render to texture
    // the following line will cause a bug if commented out.  --Ben 2023-02-01
    // if (this.#framebuffer !== framebuffer) {
    if (framebuffer instanceof CanvasFramebuffer) {
      this.gl.bindFramebuffer(GL.FRAMEBUFFER, null);
    } else if (framebuffer instanceof Framebuffer) {
      this.gl.bindFramebuffer(GL.FRAMEBUFFER, framebuffer.glFramebuffer);
    }
    this.#framebuffer = framebuffer;
    //}
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
    // setting the viewport even if it is already set is required in a number of cases, such as render to texture
    // the following line will cause a bug if commented out.  --Ben 2023-02-01
    // if (!this.initialMode && box2Equals(this.#viewport, v)) return;

    this.gl.viewport(v.x, v.y, v.width, v.height);
    this.#viewport.copy(v);
  }

  get blendState(): BlendState {
    return this.#blendState.clone();
  }

  set blendState(bs: BlendState) {
    if (!this.initialMode && bs.equals(this.#blendState)) return;

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
    //if (!this.initialMode && dts.equals(this.#depthTestState)) return;

    if (dts.enabled) {
      this.gl.enable(GL.DEPTH_TEST);
    } else {
      this.gl.disable(GL.DEPTH_TEST);
    }
    if (dts.write) {
      this.gl.depthMask(dts.write);
    }
    this.gl.depthFunc(dts.func);
    this.#depthTestState.copy(dts);
  }

  get clearState(): ClearState {
    return this.#clearState.clone();
  }

  set clearState(cs: ClearState) {
    // if (!this.initialMode && cs.equals(this.#clearState)) return;

    this.gl.clearColor(cs.color.r, cs.color.g, cs.color.b, cs.alpha);
    this.gl.clearDepth(cs.depth);
    this.gl.clearStencil(cs.stencil);
    this.#clearState.copy(cs);
  }

  get maskState(): MaskState {
    return this.#maskState.clone();
  }

  set maskState(ms: MaskState) {
    //  if (!this.initialMode && ms.equals(this.#maskState)) return;

    this.gl.colorMask(ms.red, ms.green, ms.blue, ms.alpha);
    this.gl.depthMask(ms.depth);
    this.gl.stencilMask(ms.stencil);
    this.#maskState.copy(ms);
  }

  get cullingState(): CullingState {
    return this.#cullingState.clone();
  }

  set cullingState(cs: CullingState) {
    // if (!this.initialMode && cs.equals(this.#cullingState)) return;

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
