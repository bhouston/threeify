import { Program } from './Program';
import { ProgramUniform } from './ProgramUniform';
import { ProgramUniformBuffer } from './ProgramUniformBuffer';

// based on https://gist.github.com/jialiang/2880d4cc3364df117320e8cb324c2880

export class ProgramUniformBlock {
  public readonly blockName: string;
  public readonly blockSize: number;
  public readonly uniforms: { [name: string]: ProgramUniform } = {};

  constructor(
    public readonly program: Program,
    public readonly blockIndex: number
  ) {
    const { gl } = this.program.context;
    const { glProgram } = this.program;

    const name = gl.getActiveUniformBlockName(glProgram, this.blockIndex);
    if (name === null) throw new Error('Failed to get uniform block name.');
    this.blockName = name;

    // TODO: remove this, this is just a sanity check
    // Get the index of the Uniform Block from any program
    if (this.blockIndex !== gl.getUniformBlockIndex(glProgram, this.blockName))
      throw new Error('Uniform block index inconsistency.');

    // Get the size of the Uniform Block in bytes
    this.blockSize = gl.getActiveUniformBlockParameter(
      glProgram,
      this.blockIndex,
      gl.UNIFORM_BLOCK_DATA_SIZE
    );
  }

  allocateUniformBuffer(): ProgramUniformBuffer {
    return new ProgramUniformBuffer(this);
  }

  bind(programUniformBuffer: ProgramUniformBuffer): void {
    const { gl } = this.program.context;
    const { glProgram } = this.program;

    // Bind the Uniform Buffer to the binding point
    gl.bindBufferBase(
      gl.UNIFORM_BUFFER,
      this.blockIndex,
      programUniformBuffer.glBuffer
    );

    // Bind the Uniform Buffer to the uniform block
    gl.uniformBlockBinding(glProgram, this.blockIndex, this.blockIndex);
  }
}
