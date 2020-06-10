//
// basic shader material
//
// Authors:
// * @bhouston
//

import { ProgramUniform, numTextureUnits } from "./ProgramUniform";
import { IDisposable } from "../../types/types";
import { Pool } from "../Pool";
import { ProgramAttribute } from "./ProgramAttribute";
import { RenderingContext } from "./RenderingContext";
import { Shader } from "./Shader";
import { ShaderMaterial } from "../../materials/ShaderMaterial";
import { ShaderType } from "./ShaderType";

export class Program implements IDisposable {
  disposed = false;
  context: RenderingContext;
  vertexShader: Shader;
  fragmentShader: Shader;
  glProgram: WebGLProgram;
  // TODO replace with a map for faster access
  uniforms: Array<ProgramUniform> = [];
  // TODO replace with a map for faster access
  attributes: Array<ProgramAttribute> = [];

  // attributes (required attribute buffers)
  // varying (per instance parameters)

  constructor(context: RenderingContext, shaderCodeMaterial: ShaderMaterial) {
    this.context = context;
    this.vertexShader = new Shader(this.context, shaderCodeMaterial.vertexShaderCode, ShaderType.Vertex);
    this.fragmentShader = new Shader(this.context, shaderCodeMaterial.fragmentShaderCode, ShaderType.Fragment);

    const gl = this.context.gl;

    // create a program.
    {
      const glProgram = gl.createProgram();
      if (!glProgram) {
        throw new Error("createProgram failed");
      }

      this.glProgram = glProgram;
    }

    // attach the shaders.
    gl.attachShader(this.glProgram, this.vertexShader.glShader);
    gl.attachShader(this.glProgram, this.fragmentShader.glShader);

    // link the program.
    gl.linkProgram(this.glProgram);

    // Check if it linked.
    const success = gl.getProgramParameter(this.glProgram, gl.LINK_STATUS);
    if (!success) {
      // something went wrong with the link
      const infoLog = gl.getProgramInfoLog(this.glProgram);
      throw new Error(`program filed to link: ${infoLog}`);
    }

    let textureUnitCount = 0;

    const numActiveUniforms = gl.getProgramParameter(this.glProgram, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numActiveUniforms; ++i) {
      const uniform = new ProgramUniform(this, i);
      if (numTextureUnits(uniform.uniformType) > 0) {
        uniform.textureUnit = textureUnitCount;
        textureUnitCount++;
      }
      this.uniforms.push(uniform);
    }

    const numActiveAttributes = gl.getProgramParameter(this.glProgram, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < numActiveAttributes; ++i) {
      this.attributes.push(new ProgramAttribute(this, i));
    }
  }

  setUniformValues(uniformValues: any, uniformNames: string[] | null = null): void {
    this.context.program = this;
    if (!uniformNames) {
      uniformNames = Object.keys(uniformValues) as string[];
    }
    uniformNames.forEach((uniformName) => {
      // TODO replace this.uniforms with a map for faster access
      const programUniform = this.uniforms.find((uniform) => uniform.name === uniformName);
      if (programUniform) {
        programUniform.set(uniformValues[uniformName]);
      }
    });
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

export class ProgramPool extends Pool<ShaderMaterial, Program> {
  constructor(context: RenderingContext) {
    super(context, (context: RenderingContext, shaderCodeMaterial: ShaderMaterial, program: Program | null) => {
      if (program) {
        program.dispose();
      }
      return new Program(context, shaderCodeMaterial);
    });
  }
}
