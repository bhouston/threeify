import { Program } from './Program';

// based on https://gist.github.com/jialiang/2880d4cc3364df117320e8cb324c2880

export class ProgramUniformBuffer {
  public readonly glUniformBuffer: WebGLBuffer;

  constructor(
    public readonly program: Program,
    public readonly blockName: string
  ) {
    const { gl } = program.context;
    // Get the index of the Uniform Block from any program
    const blockIndex = gl.getUniformBlockIndex(program.glProgram, blockName);

    // Get the size of the Uniform Block in bytes
    const blockSize = gl.getActiveUniformBlockParameter(
      program.glProgram,
      blockIndex,
      gl.UNIFORM_BLOCK_DATA_SIZE
    );

    // Create Uniform Buffer to store our data
    const uboBuffer = gl.createBuffer();
    if (uboBuffer === null) throw new Error('Failed to create buffer.');
    this.glUniformBuffer = uboBuffer;

    // Bind it to tell WebGL we are working on this buffer
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.glUniformBuffer);

    // Allocate memory for our buffer equal to the size of our Uniform Block
    // We use dynamic draw because we expect to respect the contents of the buffer frequently
    gl.bufferData(gl.UNIFORM_BUFFER, blockSize, gl.DYNAMIC_DRAW);
  }
}
