//
// basic shader material
//
// Authors:
// * @bhouston
//

import { Shader } from "./Shader.js";
import { Context } from "./Context.js";
import { ProgramUniform } from "./ProgramUniform.js";
import { ProgramAttribute } from "./ProgramAttribute.js";
import { IDisposable } from "../../interfaces/Standard.js";
import { ShaderType } from "../../materials/ShaderType.js";
import { ShaderCodeMaterial } from "../../materials/ShaderCodeMaterial.js";
import { Pool } from "../Pool.js";
import { UniformValue } from "./UniformValue.js";

export class Program implements IDisposable {
  disposed: boolean = false;
  context: Context;
  vertexShader: Shader;
  fragmentShader: Shader;
  glProgram: WebGLProgram;
  uniforms: Array<ProgramUniform> = []; // TODO replace with a map for faster access
  attributes: Array<ProgramAttribute> = []; // TODO replace with a map for faster access

  // attributes (required attribute buffers)
  // varying (per instance parameters)

  constructor(context: Context, shaderCodeMaterial: ShaderCodeMaterial) {
    this.context = context;
    this.vertexShader = new Shader(
      this.context,
      shaderCodeMaterial.vertexShaderCode,
      ShaderType.Vertex
    );
    this.fragmentShader = new Shader(
      this.context,
      shaderCodeMaterial.fragmentShaderCode,
      ShaderType.Fragment
    );

    let gl = this.context.gl;

    // create a program.
    {
      let glProgram = gl.createProgram();
      if (!glProgram)
        throw new Error("createProgram failed");
      
      this.glProgram = glProgram;
    }

    // attach the shaders.
    gl.attachShader(this.glProgram, this.vertexShader.glShader);
    gl.attachShader(this.glProgram, this.fragmentShader.glShader);

    // link the program.
    gl.linkProgram(this.glProgram);

    // Check if it linked.
    let success = gl.getProgramParameter(this.glProgram, gl.LINK_STATUS);
    if (!success) {
      // something went wrong with the link
      let infoLog = gl.getProgramInfoLog(this.glProgram);
      throw new Error(`program filed to link: ${infoLog}`);
    }

    let numActiveUniforms = gl.getProgramParameter(
      this.glProgram,
      gl.ACTIVE_UNIFORMS
    );
    for (let i = 0; i < numActiveUniforms; ++i) {
      this.uniforms.push(new ProgramUniform(this, i));
    }

    let numActiveAttributes = gl.getProgramParameter(
      this.glProgram,
      gl.ACTIVE_ATTRIBUTES
    );
    for (let i = 0; i < numActiveAttributes; ++i) {
      this.attributes.push(new ProgramAttribute(this, i));
    }
  }

  setUniformValues(uniformValues: any, uniformNames: string[] | null = null) {
    if (!uniformNames) {
      uniformNames = Object.keys(uniformValues) as string[];
    }
    uniformNames.forEach((uniformName) => {
      // TODO replace this.uniforms with a map for faster access
      let programUniform = this.uniforms.find(
        (uniform) => uniform.name == uniformName
      );
      if (programUniform) {
        programUniform.set(uniformValues[uniformName]);
      }
    });
  }

  dispose() {
    if (!this.disposed) {
      this.vertexShader.dispose();
      this.fragmentShader.dispose();

      this.context.gl.deleteProgram(this.glProgram);
      this.disposed = true;
    }
  }
}

export class ProgramPool extends Pool<ShaderCodeMaterial, Program> {
  constructor(context: Context) {
    super(
      context,
      (
        context: Context,
        shaderCodeMaterial: ShaderCodeMaterial,
        program: Program | null
      ) => {
        if (program) {
          program.dispose();
        }
        return new Program(context, shaderCodeMaterial);
      }
    );
  }
}
