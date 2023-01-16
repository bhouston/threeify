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
import { ShaderType } from '../shaders/ShaderType.js';
import { VertexArrayObject } from '../VertexArrayObject.js';
import { ProgramAttribute } from './ProgramAttribute.js';
import { ProgramUniform, UniformValueMap } from './ProgramUniform.js';
import { numTextureUnits } from './UniformType.js';

export type UniformMap = { [key: string]: ProgramUniform | undefined };
export type AttributeMap = { [key: string]: ProgramAttribute | undefined };

export class Program implements IResource {
  public readonly id = generateUUID();
  disposed = false;
  vertexShader: Shader;
  fragmentShader: Shader;
  glProgram: WebGLProgram;
  #validated = false;
  #uniformsInitialized = false;
  #uniforms: UniformMap = {};
  #attributesInitialized = false;
  #attributes: AttributeMap = {};

  constructor(
    public context: RenderingContext,
    vertexShaderCode: string,
    fragmentShaderCode: string,
    glslVersion: number,
    public readonly shaderDefines: string[] = []
  ) {
    if (shaderDefines.length > 0)
      throw new Error('Shader defines not yet supported');

    this.vertexShader = new Shader(
      this.context,
      vertexShaderCode,
      ShaderType.Vertex,
      glslVersion
    );
    this.fragmentShader = new Shader(
      this.context,
      fragmentShaderCode,
      ShaderType.Fragment,
      glslVersion
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
    gl.linkProgram(this.glProgram);

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

  get uniforms(): UniformMap {
    if (!this.#uniformsInitialized) {
      let textureUnitCount = 0;
      const { gl } = this.context;

      const numActiveUniforms = gl.getProgramParameter(
        this.glProgram,
        gl.ACTIVE_UNIFORMS
      );
      for (let i = 0; i < numActiveUniforms; ++i) {
        const uniform = new ProgramUniform(this, i);
        if (numTextureUnits(uniform.uniformType) > 0) {
          uniform.textureUnit = textureUnitCount;
          textureUnitCount++;
        }
        this.#uniforms[uniform.name] = uniform;
      }
      this.#uniformsInitialized = true;
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

  setUniformValues(uniformValueMap: UniformValueMap): this {
    this.context.program = this;

    for (const uniformName in uniformValueMap) {
      const uniform = this.uniforms[uniformName];
      if (uniform !== undefined) {
        uniform.set(uniformValueMap[uniformName]);
      }
    }
    return this;
  }

  setAttributeBuffers(vao: VertexArrayObject): this;
  setAttributeBuffers(bufferGeometry: BufferGeometry): this;
  setAttributeBuffers(buffers: VertexArrayObject | BufferGeometry): this {
    const { gl } = this.context;
    if (buffers instanceof BufferGeometry) {
      const bufferGeometry = buffers as BufferGeometry;
      for (const name in this.attributes) {
        const attribute = this.attributes[name];
        const bufferAccessor = bufferGeometry.bufferAccessors[name];
        if (attribute !== undefined && bufferAccessor !== undefined) {
          attribute.setBuffer(bufferAccessor);
        }
      }
      if (bufferGeometry.indices !== undefined) {
        gl.bindBuffer(
          bufferGeometry.indices.buffer.target,
          bufferGeometry.indices.buffer.glBuffer
        );
      }
    } else if (buffers instanceof VertexArrayObject) {
      const vao = buffers as VertexArrayObject;
      gl.bindVertexArray(vao.glVertexArrayObject);
    } else {
      throw new TypeError('not implemented');
    }

    return this;
  }

  dispose(): void {
    if (!this.disposed) {
      const { gl, resources } = this.context;
      this.vertexShader.dispose();
      this.fragmentShader.dispose();
      gl.deleteProgram(this.glProgram);
      resources.unregister(this);
      this.disposed = true;
    }
  }
}

export function makeProgramFromShaderMaterial(
  context: RenderingContext,
  shaderMaterial: ShaderMaterial,
  shaderDefines: string[] = []
): Program {
  return new Program(
    context,
    shaderMaterial.vertexShaderCode,
    shaderMaterial.fragmentShaderCode,
    shaderMaterial.glslVersion,
    shaderDefines
  );
}
