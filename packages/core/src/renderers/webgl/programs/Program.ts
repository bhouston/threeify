//
// basic shader material
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../../../core/generateUuid.js';
import { ShaderMaterial } from '../../../materials/ShaderMaterial.js';
import { BufferGeometry } from '../buffers/BufferGeometry.js';
import { IResource } from '../IResource.js';
import { RenderingContext } from '../RenderingContext.js';
import { Shader } from '../shaders/Shader.js';
import { ShaderDefines } from '../shaders/ShaderDefines.js';
import { ShaderType } from '../shaders/ShaderType.js';
import { ProgramAttribute } from './ProgramAttribute.js';
import { ProgramUniform } from './ProgramUniform.js';
import { ProgramUniformBlock } from './ProgramUniformBlock.js';
import { ProgramVertexArray } from './ProgramVertexArray.js';
import { numTextureUnits } from './UniformType.js';

export type UniformMap = { [name: string]: ProgramUniform };
export type UniformBlockMap = {
  [name: string]: ProgramUniformBlock;
};
export type AttributeMap = { [key: string]: ProgramAttribute };

export class Program implements IResource {
  public readonly id = generateUUID();
  public name: string;
  public readonly context: RenderingContext;
  disposed = false;
  public readonly vertexShader: Shader;
  public readonly fragmentShader: Shader;
  public readonly glProgram: WebGLProgram;
  #validated = false;
  #uniformsInitialized = false;
  #uniforms: UniformMap = {};
  #uniformBlocks: UniformBlockMap = {};
  #attributesInitialized = false;
  #attributes: AttributeMap = {};

  constructor(props: {
    context: RenderingContext;
    vertexShaderCode: string;
    fragmentShaderCode: string;
    shaderDefines?: ShaderDefines;
    name?: string;
  }) {
    const {
      context,
      vertexShaderCode,
      fragmentShaderCode,
      shaderDefines,
      name
    } = props;
    this.context = context;
    this.name = name ?? '';

    this.vertexShader = new Shader(
      this.context,
      vertexShaderCode,
      ShaderType.Vertex,
      shaderDefines
    );
    this.fragmentShader = new Shader(
      this.context,
      fragmentShaderCode,
      ShaderType.Fragment,
      shaderDefines
    );

    const { gl, resources } = this.context;

    // create a program.
    {
      const glProgram = gl.createProgram();
      if (glProgram === null) {
        throw new Error('createProgram failed');
      }

      this.glProgram = glProgram;
    }

    // attach the shaders.
    gl.attachShader(this.glProgram, this.vertexShader.glShader);
    gl.attachShader(this.glProgram, this.fragmentShader.glShader);

    // link the program.
    console.time('linkProgram, ' + this.name);
    gl.linkProgram(this.glProgram);
    console.timeEnd('linkProgram, ' + this.name);

    // NOTE: purposely not checking here if it compiled.
    resources.register(this);
  }

  // TODO: Convert this to a promise with a setTimeout(0) until the completion status is true
  validate(): boolean {
    if (this.#validated || this.disposed) {
      return true;
    }

    // This is only done if necessary and delayed per best practices here:
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#Compile_Shaders_and_Link_Programs_in_parallel

    const { gl, resources } = this.context;
    // Check if it linked.
    /* const { glxo } = this.context;
    const { KHR_parallel_shader_compile } = glxo;
    if (KHR_parallel_shader_compile !== null) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (
        !gl.getProgramParameter(
          this.glProgram,
          KHR_parallel_shader_compile.COMPLETION_STATUS_KHR
        )
      ) {
        return false;
      }
    }*/

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
      this.vertexShader.validate();
      this.fragmentShader.validate();
      // something went wrong with the link
      const infoLog = gl.getProgramInfoLog(this.glProgram);
      console.error(infoLog);
      this.vertexShader.dispose();
      this.fragmentShader.dispose();
      resources.unregister(this);
      this.disposed = true;
      throw new Error(`program filed to link: ${infoLog}`);
    }
    this.#validated = true;
    return true;
  }

  initializeUniformsAndUniformBlocks(): void {
    const { gl } = this.context;
    const numUniforms = gl.getProgramParameter(
      this.glProgram,
      gl.ACTIVE_UNIFORMS
    );
    const indices = [...Array(numUniforms).keys()];
    const blockIndices = gl.getActiveUniforms(
      this.glProgram,
      indices,
      gl.UNIFORM_BLOCK_INDEX
    );
    const blockOffsets = gl.getActiveUniforms(
      this.glProgram,
      indices,
      gl.UNIFORM_OFFSET
    );

    let textureUnitCount = 0;

    const uniformBlocks: { [blockIndex: number]: ProgramUniformBlock } = {};
    for (let i = 0; i < numUniforms; ++i) {
      const blockIndex = blockIndices[i];
      const blockOffset = blockOffsets[i];

      let uniformBlock;

      if (blockIndex !== -1) {
        uniformBlock = uniformBlocks[blockIndex];
        if (uniformBlock === undefined) {
          uniformBlock = new ProgramUniformBlock(this, blockIndex);
        }
        uniformBlocks[blockIndex] = uniformBlock;
      }

      const uniform = new ProgramUniform(this, i, uniformBlock, blockOffset);

      this.#uniforms[uniform.identifier] = uniform;

      if (numTextureUnits(uniform.uniformType) > 0) {
        uniform.textureUnit = textureUnitCount;
        textureUnitCount += uniform.arrayLength;
      }

      if (uniformBlock !== undefined) {
        this.#uniformBlocks[uniformBlock.name] = uniformBlock;
        uniformBlock.uniforms[uniform.variableName] = uniform;
      }
    }
    this.#uniformsInitialized = true;
  }

  get uniformBlocks(): UniformBlockMap {
    if (!this.#uniformsInitialized) {
      this.initializeUniformsAndUniformBlocks();
    }
    return this.#uniformBlocks;
  }

  get uniforms(): UniformMap {
    if (!this.#uniformsInitialized) {
      this.initializeUniformsAndUniformBlocks();
    }
    return this.#uniforms;
  }

  get attributes(): AttributeMap {
    if (!this.#attributesInitialized) {
      const { gl } = this.context;
      const numActiveAttributes = gl.getProgramParameter(
        this.glProgram,
        gl.ACTIVE_ATTRIBUTES
      );
      for (let i = 0; i < numActiveAttributes; ++i) {
        const attribute = new ProgramAttribute(this, i);
        this.#attributes[attribute.name] = attribute;
      }
      this.#attributesInitialized = true;
    }
    return this.#attributes;
  }

  setAttributeBuffers(vao: ProgramVertexArray): this;
  setAttributeBuffers(
    bufferGeometry: BufferGeometry,
    creatingVertexArray?: boolean
  ): this;
  setAttributeBuffers(
    buffers: ProgramVertexArray | BufferGeometry,
    creatingVertexArray = false
  ): this {
    const { gl } = this.context;
    if (buffers instanceof BufferGeometry) {
      if (!creatingVertexArray) {
        console.log('unbinding vertex array object');
        gl.bindVertexArray(null);
      }
      const bufferGeometry = buffers as BufferGeometry;
      for (const name in this.attributes) {
        const attribute = this.attributes[name];
        const bufferAccessor = bufferGeometry.bufferAccessors[name];
        if (attribute !== undefined && bufferAccessor !== undefined) {
          attribute.setBuffer(bufferAccessor);
        } else {
          attribute.disable();
        }
      }
      if (bufferGeometry.indices !== undefined) {
        console.log('assigning index buffer');
        gl.bindBuffer(
          bufferGeometry.indices.buffer.target,
          bufferGeometry.indices.buffer.glBuffer
        );
      }
    } else if (buffers instanceof ProgramVertexArray) {
      console.log('binding vertex array object');
      const vao = buffers as ProgramVertexArray;
      gl.bindVertexArray(vao.glVertexArrayObject);
    } else {
      throw new TypeError('not implemented');
    }

    return this;
  }

  dispose(): void {
    if (this.disposed) return;

    const { gl, resources } = this.context;
    this.vertexShader.dispose();
    this.fragmentShader.dispose();
    gl.deleteProgram(this.glProgram);
    resources.unregister(this);
    this.disposed = true;
  }
}

export function makeProgramFromShaderMaterial(
  context: RenderingContext,
  shaderMaterial: ShaderMaterial,
  shaderDefines: ShaderDefines = {}
): Program {
  const program = new Program({
    context,
    vertexShaderCode: shaderMaterial.vertexShaderCode,
    fragmentShaderCode: shaderMaterial.fragmentShaderCode,
    shaderDefines,
    name: shaderMaterial.name
  });
  return program;
}
