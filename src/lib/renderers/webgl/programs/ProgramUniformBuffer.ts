import { Program } from './Program';

// based on https://gist.github.com/jialiang/2880d4cc3364df117320e8cb324c2880

export class ProgramUniformBuffer {
  public readonly glUniformBuffer: WebGLBuffer;
  public readonly blockIndex: number;
  public readonly blockSize: number;

  constructor(
    public readonly program: Program,
    public readonly blockName: string
  ) {
    const { gl } = program.context;
    // Get the index of the Uniform Block from any program
    this.blockIndex = gl.getUniformBlockIndex(
      this.program.glProgram,
      this.blockName
    );

    // getActiveUniformBlockName(program: WebGLProgram, uniformBlockIndex: GLuint): string | null;

    // Get the size of the Uniform Block in bytes
    this.blockSize = gl.getActiveUniformBlockParameter(
      this.program.glProgram,
      this.blockIndex,
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
    gl.bufferData(gl.UNIFORM_BUFFER, this.blockSize, gl.DYNAMIC_DRAW);

    // Bind the buffer to a binding point
    // Think of it as storing the buffer into a special UBO ArrayList
    // The second argument is the index you want to store your Uniform Buffer in
    // Let's say you have 2 unique UBO, you'll store the first one in index 0 and the second one in index 1
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, uboBuffer);

    // Name of the member variables inside of our Uniform Block
    const uboVariableNames = ['u_PointSize', 'u_Color'];

    // Get the respective index of the member variables inside our Uniform Block
    const uboVariableIndices = gl.getUniformIndices(
      program_normal,
      uboVariableNames
    );

    // Get the offset of the member variables inside our Uniform Block in bytes
    const uboVariableOffsets = gl.getActiveUniforms(
      program_normal,
      uboVariableIndices,
      gl.UNIFORM_OFFSET
    );

    // Create an object to map each variable name to its respective index and offset
    const uboVariableInfo = {};

    uboVariableNames.forEach((name, index) => {
      uboVariableInfo[name] = {
        index: uboVariableIndices[index],
        offset: uboVariableOffsets[index]
      };
    });
  }
}
