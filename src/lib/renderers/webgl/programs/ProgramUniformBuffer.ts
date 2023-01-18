import { generateUUID } from '../../../core/generateUuid';
import { IResource } from '../IResource';
import { ProgramUniformBlock } from './ProgramUniformBlock';
import { uniformTypeInfo } from './UniformType';
import { uniformValueToArrayBuffer } from './UniformValue';
import { UniformValue } from './UniformValueMap';

export class ProgramUniformBuffer implements IResource {
  public readonly id = generateUUID();
  disposed = false;
  static nextBindTarget = 0;

  public readonly glBuffer: WebGLBuffer;

  constructor(public readonly programUniformBlock: ProgramUniformBlock) {
    const { gl } = programUniformBlock.program.context;

    // Create Uniform Buffer to store our data
    const uboBuffer = gl.createBuffer();
    if (uboBuffer === null) throw new Error('Failed to create buffer.');
    this.glBuffer = uboBuffer;

    // Bind it to tell WebGL we are working on this buffer
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.glBuffer);

    // Allocate memory for our buffer equal to the size of our Uniform Block
    // We use dynamic draw because we expect to respect the contents of the buffer frequently
    gl.bufferData(
      gl.UNIFORM_BUFFER,
      this.programUniformBlock.blockSize,
      gl.DYNAMIC_DRAW
    );

    return this;
  }

  dispose() {
    if (this.disposed) return;

    const { gl } = this.programUniformBlock.program.context;
    gl.deleteBuffer(this.glBuffer);
    this.disposed = true;
  }

  set(uniformName: string, uniformValue: UniformValue): this {
    const { gl } = this.programUniformBlock.program.context;

    const uniform = this.programUniformBlock.uniforms[uniformName];
    if (uniform === undefined) {
      throw new Error(`Uniform ${uniformName} not found.`);
    }

    const { blockOffset, uniformType, size } = uniform;
    const typeInfo = uniformTypeInfo(uniformType);

    const numElements = typeInfo.numElements * size;
    const sizeInBytes = numElements * typeInfo.bytesPerElement;

    // Bind the buffer to tell WebGL we are working on this buffer
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.glBuffer);

    // Write data into the buffer
    gl.bufferSubData(
      gl.UNIFORM_BUFFER,
      blockOffset,
      uniformValueToArrayBuffer(uniformType, uniformValue),
      0,
      sizeInBytes
    );

    return this;
  }
}

// implementation of the type used above that has the properties numElements and bytesPerElement
