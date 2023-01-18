import { Buffer } from '../buffers/Buffer';
import { BufferTarget } from '../buffers/BufferTarget';
import { BufferUsage } from '../buffers/BufferUsage';
import { Program } from './Program';
import { ProgramUniform } from './ProgramUniform';
import { UniformValueMap } from './UniformValueMap';

// based on https://gist.github.com/jialiang/2880d4cc3364df117320e8cb324c2880
export type UniformBufferMap = { [name: string]: Buffer };

export class ProgramUniformBlock {
  static nextBindIndex = 0;

  public readonly name: string;
  public readonly blockSize: number;
  public readonly uniforms: { [name: string]: ProgramUniform } = {};
  public binding = ProgramUniformBlock.nextBindIndex++;

  constructor(
    public readonly program: Program,
    public readonly blockIndex: number
  ) {
    const { gl } = this.program.context;
    const { glProgram } = this.program;

    const name = gl.getActiveUniformBlockName(glProgram, this.blockIndex);
    if (name === null) throw new Error('Failed to get uniform block name.');
    this.name = name;

    // TODO: remove this, this is just a sanity check
    // Get the index of the Uniform Block from any program
    if (this.blockIndex !== gl.getUniformBlockIndex(glProgram, this.name))
      throw new Error('Uniform block index inconsistency.');

    // Get the size of the Uniform Block in bytes
    this.blockSize = gl.getActiveUniformBlockParameter(
      glProgram,
      this.blockIndex,
      gl.UNIFORM_BLOCK_DATA_SIZE
    );
  }

  allocateUniformBuffer(): Buffer {
    return new Buffer(
      this.program.context,
      new ArrayBuffer(this.blockSize),
      BufferTarget.Uniform,
      BufferUsage.DynamicDraw
    );
  }

  bind(buffer: Buffer): void {
    // nothing to do, already bound.

    const { gl } = this.program.context;
    const { glProgram } = this.program;

    if (this.binding !== -1) {
      gl.bindBufferBase(buffer.target, this.binding, buffer.glBuffer);
    }

    // Bind the Uniform Buffer to the uniform block
    gl.uniformBlockBinding(glProgram, this.blockIndex, this.binding);
  }

  setUniformsIntoBuffer(
    uniformValueMap: UniformValueMap,
    buffer: Buffer
  ): this {
    for (const uniformName in uniformValueMap) {
      const uniform = this.uniforms[uniformName];
      if (uniform !== undefined) {
        uniform.setIntoBuffer(uniformValueMap[uniformName], buffer);
      }
    }
    return this;
  }
}
