import { Buffer } from '../buffers/Buffer.js';
import { BufferTarget } from '../buffers/BufferTarget.js';
import { BufferUsage } from '../buffers/BufferUsage.js';
import { Program } from './Program.js';
import { ProgramUniform } from './ProgramUniform.js';
import { UniformValueMap } from './UniformValueMap.js';

// based on https://gist.github.com/jialiang/2880d4cc3364df117320e8cb324c2880
export type UniformBufferMap = { [name: string]: Buffer };

export class ProgramUniformBlock {
  static nextBindIndex = 0;

  public readonly name: string;
  public readonly blockSize: number;
  public readonly uniforms: { [name: string]: ProgramUniform } = {};
  public binding = ProgramUniformBlock.nextBindIndex++;
  public boundBuffer?: Buffer;

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

    if (this.boundBuffer !== buffer) {
      if (this.binding !== -1) {
        gl.bindBufferBase(buffer.target, this.binding, buffer.glBuffer);
      }

      // Bind the Uniform Buffer to the uniform block
      gl.uniformBlockBinding(glProgram, this.blockIndex, this.binding);

      this.boundBuffer = buffer;
    }
  }

  setUniformsIntoBuffer(
    uniformValueMap: UniformValueMap,
    buffer: Buffer
  ): this {
    //console.log('setting uniforms into buffer', uniformValueMap);
    for (const uniformName in uniformValueMap) {
      const uniform = this.uniforms[uniformName];
      //console.log('setting uniform', uniformName, uniform);
      if (uniform !== undefined) {
        uniform.setIntoBuffer(uniformValueMap[uniformName], buffer);
      }
    }
    //console.log('done setting uniforms into buffer');
    return this;
  }
}
