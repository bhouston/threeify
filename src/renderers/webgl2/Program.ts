//
// basic shader material
//
// Authors:
// * @bhouston
//

import { Dictionary } from "../../core/Dictionary";
import { IDisposable } from "../../core/types";
import { ShaderMaterial } from "../../materials/ShaderMaterial";
import { Pool } from "../Pool";
import { ProgramAttribute } from "./ProgramAttribute";
import { ProgramUniform } from "./ProgramUniform";
import { RenderingContext } from "./RenderingContext";
import { Shader } from "./Shader";
import { ShaderType } from "./ShaderType";
import { numTextureUnits } from "./UniformType";

export class Program implements IDisposable {
  disposed = false;
  vertexShader: Shader;
  fragmentShader: Shader;
  glProgram: WebGLProgram;
  uniforms = new Dictionary<string, ProgramUniform>();
  attributes = new Dictionary<string, ProgramAttribute>();

  constructor(public context: RenderingContext, shaderMaterial: ShaderMaterial) {
    this.vertexShader = new Shader(this.context, shaderMaterial.vertexShaderCode, ShaderType.Vertex);
    this.fragmentShader = new Shader(this.context, shaderMaterial.fragmentShaderCode, ShaderType.Fragment);

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

    // Check if it linked.
    const success = gl.getProgramParameter(this.glProgram, gl.LINK_STATUS);
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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
      this.uniforms.set(uniform.name, uniform);
    }

    const numActiveAttributes = gl.getProgramParameter(this.glProgram, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < numActiveAttributes; ++i) {
      const attribute = new ProgramAttribute(this, i);
      this.attributes.set(attribute.name, attribute);
    }
  }

  setUniformValues(uniformValues: any, uniformNames: string[] | null = null): void {
    this.context.program = this;
    if (uniformNames !== null) {
      uniformNames = Object.keys(uniformValues) as string[];
    }
    uniformNames.forEach((uniformName) => {
      // TODO replace this.uniforms with a map for faster access
      const uniform = this.uniforms.get(uniformName);
      if (uniform !== null) {
        uniform.set(uniformValues[uniformName]);
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
      if (program !== null) {
        program.dispose();
      }
      return new Program(context, shaderCodeMaterial);
    });
  }
}
