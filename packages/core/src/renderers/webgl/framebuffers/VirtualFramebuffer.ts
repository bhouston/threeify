//
// based on https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
//
// Authors:
// * @bhouston
//

import { Box2, Vec2 } from '@threeify/vector-math';

import { IDisposable } from '../../../core/types.js';
import { warnOnce } from '../../../warnOnce.js';
import { BlendState } from '../BlendState.js';
import { BufferGeometry } from '../buffers/BufferGeometry.js';
import { ClearState } from '../ClearState.js';
import { CullingState } from '../CullingState.js';
import { DepthTestState } from '../DepthTestState.js';
import { MaskState } from '../MaskState.js';
import { Program } from '../programs/Program.js';
import { UniformBufferMap } from '../programs/ProgramUniformBlock.js';
import { ProgramVertexArray } from '../programs/ProgramVertexArray.js';
import { UniformValueMap } from '../programs/UniformValueMap.js';
import { RenderingContext } from '../RenderingContext.js';
import { bindTextures, TextureBindings } from '../textures/TextureBindings.js';
import { BufferBit } from './BufferBit.js';

export abstract class VirtualFramebuffer implements IDisposable {
  disposed = false;
  public cullingState: CullingState | undefined = undefined;
  public clearState: ClearState | undefined = undefined;
  public depthTestState: DepthTestState | undefined = undefined;
  public blendState: BlendState | undefined = undefined;
  public maskState: MaskState | undefined = undefined;
  public viewport: Box2 | undefined = undefined;

  constructor(public context: RenderingContext) {}

  abstract get size(): Vec2;

  clear(
    attachmentBits: BufferBit = BufferBit.Color |
      BufferBit.Depth |
      BufferBit.Stencil,
    clearState: ClearState | undefined = undefined
  ): void {
    this.context.framebuffer = this;
    this.context.clearState =
      clearState ?? this.clearState ?? this.context.clearState;
    const { gl } = this.context;
    gl.clear(attachmentBits);
  }

  flush(): void {
    this.context.gl.flush();
  }

  finish(): void {
    this.context.gl.finish();
  }

  abstract dispose(): void;
}

export function renderBufferGeometry(props: {
  framebuffer: VirtualFramebuffer;
  program: Program;
  bufferGeometry: BufferGeometry;
  uniforms?: UniformValueMap | UniformValueMap[];
  uniformBuffers?: UniformBufferMap;
  programVertexArray?: ProgramVertexArray;
  depthTestState?: DepthTestState;
  blendState?: BlendState;
  maskState?: MaskState;
  cullingState?: CullingState;
}): void {
  const {
    framebuffer,
    blendState,
    depthTestState,
    maskState,
    cullingState,
    program,
    uniforms: uniformValueMaps,
    uniformBuffers: uniformBufferMap,
    bufferGeometry,
    programVertexArray
  } = props;
  const { context, size } = framebuffer;

  const textureBindings = new TextureBindings();

  context.framebuffer = framebuffer;
  context.program = program;

  context.blendState =
    blendState ?? framebuffer.blendState ?? context.blendState;
  context.depthTestState =
    depthTestState ?? framebuffer.depthTestState ?? context.depthTestState;
  context.maskState = maskState ?? framebuffer.maskState ?? context.maskState;
  context.cullingState =
    cullingState ?? framebuffer.cullingState ?? context.cullingState;

  setProgramUniforms(
    context.program,
    uniformValueMaps,
    uniformBufferMap,
    textureBindings
  );

  if (textureBindings !== undefined) {
    bindTextures(context, textureBindings);
  }

  if (programVertexArray !== undefined) {
    context.program.setAttributeBuffers(programVertexArray);
  } else {
    context.program.setAttributeBuffers(bufferGeometry);
  }
  context.viewport = new Box2(new Vec2(), size);

  // draw
  const { gl } = context;
  if (bufferGeometry.indices !== undefined) {
    gl.drawElements(
      bufferGeometry.primitive,
      bufferGeometry.count,
      bufferGeometry.indices.componentType,
      0
    );
  } else {
    gl.drawArrays(bufferGeometry.primitive, 0, bufferGeometry.count);
  }

  // unbind VAO as leaving it bind will allow others to modify its state!
  if (programVertexArray !== undefined) {
    gl.bindVertexArray(null);
  }
}

function setProgramUniforms(
  program: Program,
  uniformValueMaps?: UniformValueMap | UniformValueMap[],
  uniformBufferMap?: UniformBufferMap,
  textureBindings?: TextureBindings
) {
  for (const uniformValueMap of uniformValueMaps instanceof Array
    ? uniformValueMaps
    : [uniformValueMaps]) {
    for (const uniformName in uniformValueMap) {
      const uniform = program.uniforms[uniformName];
      if (uniform !== undefined && uniform.block === undefined) {
        uniform.setIntoLocation(uniformValueMap[uniformName], textureBindings);
      } else {
        warnOnce(`Uniform ${uniformName} not found in program ${program.name}`);
      }
    }
  }

  if (uniformBufferMap !== undefined) {
    for (const uniformBufferName in uniformBufferMap) {
      const uniformBlock = program.uniformBlocks[uniformBufferName];
      if (uniformBlock !== undefined) {
        uniformBlock.bind(uniformBufferMap[uniformBufferName]);
      } else {
        /*   warnOnce(
          `Uniform block ${uniformBufferName} not found in program ${program.name}`
        );*/
      }
    }
  }
}
