import { ProgramUniformBlock } from './ProgramUniformBlock';
import { uniformTypeInfo } from './UniformType';
import { UniformValue } from './UniformValueMap';

export class UniformBuffer {
  public readonly glUniformBuffer: WebGLBuffer;

  constructor(public readonly programUniformBlock: ProgramUniformBlock) {
    const { gl } = programUniformBlock.program.context;

    // Create Uniform Buffer to store our data
    const uboBuffer = gl.createBuffer();
    if (uboBuffer === null) throw new Error('Failed to create buffer.');
    this.glUniformBuffer = uboBuffer;

    // Bind it to tell WebGL we are working on this buffer
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.glUniformBuffer);

    // Allocate memory for our buffer equal to the size of our Uniform Block
    // We use dynamic draw because we expect to respect the contents of the buffer frequently
    gl.bufferData(
      gl.UNIFORM_BUFFER,
      this.programUniformBlock.blockSize,
      gl.DYNAMIC_DRAW
    );

    // Bind the buffer to a binding point
    // Think of it as storing the buffer into a special UBO ArrayList
    // The second argument is the index you want to store your Uniform Buffer in
    // Let's say you have 2 unique UBO, you'll store the first one in index 0 and the second one in index 1
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, uboBuffer);
  }

  set(uniformName: string, uniformValue: UniformValue): this {
    const { gl } = this.programUniformBlock.program.context;
    const { glProgram } = this.programUniformBlock.program;

    const uniform = this.programUniformBlock.uniforms[uniformName];
    if (uniform === undefined) {
      throw new Error(`Uniform ${uniformName} not found.`);
    }

    const { blockOffset, uniformType, size } = uniform;
    const typeInfo = uniformTypeInfo(uniformType);

    const numElements = typeInfo.numElements * size;

    // Bind the buffer to tell WebGL we are working on this buffer
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.glUniformBuffer);

    // Write data into the buffer
    gl.bufferSubData(
      gl.UNIFORM_BUFFER,
      blockOffset,
      uniformValue,
      0,
      numElements,
      typeInfo.glType
    );

    return this;
  }
}

// implementation of the type used above that has the properties numElements and bytesPerElement
