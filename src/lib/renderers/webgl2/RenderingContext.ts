//
// basic context
//
// Authors:
// * @bhouston
//

import { Box2 } from "../../math/Box2";
import { Camera } from "../../nodes/cameras/Camera";
import { Node } from "../../nodes/Node";
import { BlendState } from "./BlendState";
import { BufferPool } from "./buffers/Buffer";
import { ClearState } from "./ClearState";
import { DepthTestState } from "./DepthTestState";
import { CanvasFramebuffer } from "./framebuffers/CanvasFramebuffer";
import { Framebuffer } from "./framebuffers/Framebuffer";
import { VirtualFramebuffer } from "./framebuffers/VirtualFramebuffer";
import { MaskState } from "./MaskState";
import { Program, ProgramPool } from "./programs/Program";
import { TexImage2DPool } from "./textures/TexImage2D";

const GL = WebGLRenderingContext;

export class RenderingContext {
  readonly gl: WebGL2RenderingContext;
  readonly canvasFramebuffer: CanvasFramebuffer;
  readonly texImage2DPool: TexImage2DPool;
  readonly programPool: ProgramPool;
  readonly bufferPool: BufferPool;

  #program: Program | null = null;
  #framebuffer: VirtualFramebuffer;
  #scissor: Box2 = new Box2();
  #viewport: Box2 = new Box2();
  #depthTestState: DepthTestState = new DepthTestState();
  #blendState: BlendState = new BlendState();
  #clearState: ClearState = new ClearState();
  #maskState: MaskState = new MaskState();

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
    this.texImage2DPool = new TexImage2DPool(this);
    this.programPool = new ProgramPool(this);
    this.bufferPool = new BufferPool(this);
    this.#framebuffer = this.canvasFramebuffer;
  }

  set program(program: Program | null) {
    if (this.#program !== program) {
      if (program) {
        this.gl.useProgram(program.glProgram);
      } else {
        this.gl.useProgram(null);
      }
      this.#program = program;
    }
  }
  get program(): Program | null {
    return this.#program;
  }

  set framebuffer(framebuffer: VirtualFramebuffer) {
    if (this.#framebuffer !== framebuffer) {
      if (framebuffer instanceof CanvasFramebuffer) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      } else if (framebuffer instanceof Framebuffer) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer.glFramebuffer);
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
    if (!this.#scissor.equals(s)) {
      this.gl.scissor(s.x, s.y, s.width, s.height);
      this.#scissor.copy(s);
    }
  }

  // specifies the affine transformation of x and y from normalized device coordinates to window coordinates.
  get viewport(): Box2 {
    return this.#viewport.clone();
  }
  set viewport(v: Box2) {
    if (!this.#viewport.equals(v)) {
      this.gl.scissor(v.x, v.y, v.width, v.height);
      this.#viewport.copy(v);
    }
  }

  get blendState(): BlendState {
    return this.#blendState.clone();
  }
  set blendState(bs: BlendState) {
    if (!this.#blendState.equals(bs)) {
      if (bs.enabled) {
        this.gl.enable(GL.BLEND);
      } else {
        this.gl.disable(GL.BLEND);
      }
      this.gl.blendEquation(bs.equation);
      this.gl.blendFuncSeparate(bs.sourceRGBFactor, bs.destRGBFactor, bs.sourceAlphaFactor, bs.destAlphaFactor);
      this.#blendState.copy(bs);
    }
  }

  get depthTestState(): DepthTestState {
    return this.#depthTestState.clone();
  }
  set depthTestState(dts: DepthTestState) {
    if (!this.#depthTestState.equals(dts)) {
      if (dts.enabled) {
        this.gl.enable(GL.DEPTH_TEST);
      } else {
        this.gl.disable(GL.DEPTH_TEST);
      }
      this.gl.depthFunc(dts.func);
      this.#depthTestState.copy(dts);
    }
  }

  get clearState(): ClearState {
    return this.#clearState.clone();
  }
  set clearState(cs: ClearState) {
    if (!this.#clearState.equals(cs)) {
      this.gl.clearColor(cs.color.r, cs.color.g, cs.color.b, cs.alpha);
      this.gl.clearDepth(cs.depth);
      this.gl.clearStencil(cs.stencil);
      this.#clearState.copy(cs);
    }
  }

  get maskState(): MaskState {
    return this.#maskState.clone();
  }
  set maskState(ms: MaskState) {
    if (!this.#maskState.equals(ms)) {
      this.gl.colorMask(ms.red, ms.green, ms.blue, ms.alpha);
      this.gl.depthMask(ms.depth);
      this.gl.stencilMask(ms.stencil);
      this.#maskState.copy(ms);
    }
  }

  renderPass(program: Program, uniforms: any): void {
    throw new Error("not implemented");
  }

  render(node: Node, camera: Camera): void {
    throw new Error("not implemented");
  }
}
