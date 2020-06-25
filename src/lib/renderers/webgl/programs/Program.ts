//
// basic shader material
//
// Authors:
// * @bhouston
//

import { IDisposable } from "../../../core/types";
import { ShaderMaterial } from "../../../materials/ShaderMaterial";
import { Pool } from "../../Pool";
import { BufferGeometry } from "../buffers/BufferGeometry";
import { RenderingContext } from "../RenderingContext";
import { Shader } from "../shaders/Shader";
import { ShaderType } from "../shaders/ShaderType";
import { VertexArrayObject } from "../VertexArrayObject";
import { ProgramAttribute } from "./ProgramAttribute";
import { ProgramUniform, UniformValueMap } from "./ProgramUniform";
import { numTextureUnits } from "./UniformType";

export type UniformMap = { [key: string]: ProgramUniform | undefined };
export type AttributeMap = { [key: string]: ProgramAttribute | undefined };

export class Program implements IDisposable {
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
  ) {
    this.vertexShader = new Shader(this.context, vertexShaderCode, ShaderType.Vertex, glslVersion);
    this.fragmentShader = new Shader(this.context, fragmentShaderCode, ShaderType.Fragment, glslVersion);

    const gl = this.context.gl;

    // create a program.
    {
      const glProgram = gl.createProgram();
      if (glProgram === null) {
        throw new Error("createProgram failed");
      }

      this.glProgram = glProgram;
    }

    // attach the shaders.
    gl.attachShader(this.glProgram, this.vertexShader.glShader);
    gl.attachShader(this.glProgram, this.fragmentShader.glShader);

    // link the program.
    gl.linkProgram(this.glProgram);

    // NOTE: purposely not checking here if it compiled.
  }

  // TODO: Convert this to a promise with a setTimeout(0) until the completion status is true
  validate(): boolean {
    if (this.#validated) {
      return true;
    }

    // This is only done if necessary and delayed per best practices here:
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#Compile_Shaders_and_Link_Programs_in_parallel

    const gl = this.context.gl;
    // Check if it linked.
    const psc = this.context.glxo.KHR_parallel_shader_compile;
    if (psc !== null) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!gl.getProgramParameter(this.glProgram, psc.COMPLETION_STATUS_KHR)) {
        return false;
      }
    }

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
      this.vertexShader.validate();
      this.fragmentShader.validate();
      // something went wrong with the link
      const infoLog = gl.getProgramInfoLog(this.glProgram);
      console.error(infoLog);
      throw new Error(`program filed to link: ${infoLog}`);
    }
    this.#validated = true;
    return true;
  }

  get uniforms(): UniformMap {
    if (!this.#uniformsInitialized) {
      let textureUnitCount = 0;
      const gl = this.context.gl;

      const numActiveUniforms = gl.getProgramParameter(this.glProgram, gl.ACTIVE_UNIFORMS);
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
      const gl = this.context.gl;
      const numActiveAttributes = gl.getProgramParameter(this.glProgram, gl.ACTIVE_ATTRIBUTES);
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
    const gl = this.context.gl;
    const glxVAO = this.context.glx.OES_vertex_array_object;
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
        gl.bindBuffer(bufferGeometry.indices.buffer.target, bufferGeometry.indices.buffer.glBuffer);
      }
    } else if (buffers instanceof VertexArrayObject) {
      const vao = buffers as VertexArrayObject;
      glxVAO.bindVertexArrayOES(vao.glVertexArrayObject);
    } else {
      throw new Error("not implemented");
    }

    return this;
  }

  dispose(): void {
    if (!this.disposed) {
      this.vertexShader.dispose();
      this.fragmentShader.dispose();
      this.context.gl.deleteProgram(this.glProgram);
      this.disposed = true;
    }
  }
}

export function makeProgramFromShaderMaterial(context: RenderingContext, shaderMaterial: ShaderMaterial): Program {
  return new Program(
    context,
    shaderMaterial.vertexShaderCode,
    shaderMaterial.fragmentShaderCode,
    shaderMaterial.glslVersion,
  );
}

export class ProgramPool extends Pool<ShaderMaterial, Program> {
  constructor(context: RenderingContext) {
    super(context, (context: RenderingContext, shaderCodeMaterial: ShaderMaterial, program: Program | undefined) => {
      if (program !== undefined) {
        program.dispose();
      }
      return makeProgramFromShaderMaterial(context, shaderCodeMaterial);
    });
  }
}
