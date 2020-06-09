//
// basic context
//
// Authors:
// * @bhouston
//

import { Program, ProgramPool } from "./Program";
import { BlendState } from "./BlendState";
import { Box2 } from "../../math/Box2";
import { BufferPool } from "./Buffer";
import { Camera } from "../../nodes/cameras/Camera";
import { CanvasFramebuffer } from "./CanvasFramebuffer";
import { ClearState } from "./ClearState";
import { DepthTestState } from "./DepthTestState";
import { Framebuffer } from "./Framebuffer";
import { MaskState } from "./MaskState";
import { Node } from "../../nodes/Node";
import { TexImage2DPool } from "./TexImage2D";
import { VirtualFramebuffer } from "./VirtualFramebuffer";

const GL = WebGLRenderingContext;

export class RenderingContext {
  readonly gl: WebGL2RenderingContext;
  readonly canvasFramebuffer: CanvasFramebuffer;
  readonly texImage2DPool: TexImage2DPool = new TexImage2DPool(this);
  readonly programPool: ProgramPool = new ProgramPool(this);
  readonly bufferPool: BufferPool = new BufferPool(this);

  private _program: Program | null = null;
  private _framebuffer: VirtualFramebuffer;
  private _scissor: Box2 = new Box2();
  private _viewport: Box2 = new Box2();
  private _depthTestState: DepthTestState = new DepthTestState();
  private _blendState: BlendState = new BlendState();
  private _clearState: ClearState = new ClearState();
  private _maskState: MaskState = new MaskState();

  constructor(canvas: HTMLCanvasElement | null = null) {
    if (!canvas) {
      canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas") as HTMLCanvasElement;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    }
    {
      const gl = canvas.getContext("webgl2");
      if (!gl) {
        throw new Error("webgl2 not supported");
      }

      this.gl = gl;
    }
    this.canvasFramebuffer = new CanvasFramebuffer(this, canvas);
    this._framebuffer = this.canvasFramebuffer;
  }

  set program(program: Program | null) {
    if (this._program !== program) {
      if (program) {
        this.gl.useProgram(program.glProgram);
      } else {
        this.gl.useProgram(null);
      }
      this._program = program;
    }
  }
  get program(): Program | null {
    return this._program;
  }

  set framebuffer(framebuffer: VirtualFramebuffer) {
    if (this._framebuffer !== framebuffer) {
      if (framebuffer instanceof CanvasFramebuffer) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      } else if (framebuffer instanceof Framebuffer) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer.glFramebuffer);
      }
      this._framebuffer = framebuffer;
    }
  }
  get framebuffer(): VirtualFramebuffer {
    return this._framebuffer;
  }

  //
  get scissor(): Box2 {
    return this._scissor.clone();
  }
  set scissor(s: Box2) {
    if (!this._scissor.equals(s)) {
      this.gl.scissor(s.x, s.y, s.width, s.height);
      this._scissor.copy(s);
    }
  }

  // specifies the affine transformation of x and y from normalized device coordinates to window coordinates.
  get viewport(): Box2 {
    return this._viewport.clone();
  }
  set viewport(v: Box2) {
    if (!this._viewport.equals(v)) {
      this.gl.scissor(v.x, v.y, v.width, v.height);
      this._viewport.copy(v);
    }
  }

  get blendState(): BlendState {
    return this._blendState.clone();
  }
  set blendState(bs: BlendState) {
    if (!this._blendState.equals(bs)) {
      if (bs.enabled) {
        this.gl.enable(GL.BLEND);
      } else {
        this.gl.disable(GL.BLEND);
      }
      this.gl.blendEquation(bs.equation);
      this.gl.blendFuncSeparate(bs.sourceRGBFactor, bs.destRGBFactor, bs.sourceAlphaFactor, bs.destAlphaFactor);
      this._blendState.copy(bs);
    }
  }

  get depthTestState(): DepthTestState {
    return this._depthTestState.clone();
  }
  set depthTestState(dts: DepthTestState) {
    if (!this._depthTestState.equals(dts)) {
      if (dts.enabled) {
        this.gl.enable(GL.DEPTH_TEST);
      } else {
        this.gl.disable(GL.DEPTH_TEST);
      }
      this.gl.depthFunc(dts.func);
      this._depthTestState.copy(dts);
    }
  }

  get clearState(): ClearState {
    return this._clearState.clone();
  }
  set clearState(cs: ClearState) {
    if (!this._clearState.equals(cs)) {
      this.gl.clearColor(cs.color.r, cs.color.g, cs.color.b, cs.alpha);
      this.gl.clearDepth(cs.depth);
      this.gl.clearStencil(cs.stencil);
      this._clearState.copy(cs);
    }
  }

  get maskState(): MaskState {
    return this._maskState.clone();
  }
  set maskState(ms: MaskState) {
    if (!this._maskState.equals(ms)) {
      this.gl.colorMask(ms.red, ms.green, ms.blue, ms.alpha);
      this.gl.depthMask(ms.depth);
      this.gl.stencilMask(ms.stencil);
      this._maskState.copy(ms);
    }
  }

  renderPass(program: Program, uniforms: any): void {
    throw new Error("not implemented");
  }

  render(node: Node, camera: Camera): void {
    throw new Error("not implemented");
  }
}
