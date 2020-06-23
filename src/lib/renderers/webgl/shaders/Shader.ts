//
// basic shader
//
// Authors:
// * @bhouston
//

import { IDisposable } from "../../../core/types";
import { GL } from "../GL";
import { RenderingContext } from "../RenderingContext";
import { ShaderType } from "./ShaderType";

export class Shader implements IDisposable {
  disposed = false;
  glShader: WebGLShader;

  constructor(
    public context: RenderingContext,
    public sourceCode: string,
    public shaderType: ShaderType,
    public glslVersion = 300,
  ) {
    const gl = this.context.gl;

    // Create the shader object
    {
      const glShader = gl.createShader(shaderType);
      if (glShader === null) {
        throw new Error("createShader failed");
      }

      this.glShader = glShader;
    }

    const prefix = [];
    if (glslVersion === 300) {
      prefix.push("#version 300 es");
    }
    if (shaderType === ShaderType.Fragment) {
      prefix.push("#extension GL_EXT_shader_texture_lod : enable");
      prefix.push("#extension GL_OES_standard_derivatives : enable");
    }
    const combinedSourceCode = prefix.join("\n") + "\n" + sourceCode;

    // Set the shader source code.
    gl.shaderSource(this.glShader, combinedSourceCode);

    // Compile the shader
    gl.compileShader(this.glShader);

    // Check if it compiled
    const success = gl.getShaderParameter(this.glShader, GL.COMPILE_STATUS);
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!success) {
      // Something went wrong during compilation; get the error
      const infoLog = gl.getShaderInfoLog(this.glShader);
      const errorMessage = `could not compile shader: ${infoLog}`;
      console.error(errorMessage, sourceCode);
      throw new Error(errorMessage);
    }
  }

  get translatedSourceCode(): string {
    const ds = this.context.glxo.WEBGL_debug_shaders;
    if (ds !== null) {
      return ds.getTranslatedShaderSource(this.glShader);
    }
    return "";
  }

  dispose(): void {
    if (!this.disposed) {
      this.context.gl.deleteShader(this.glShader);
      this.disposed = true;
    }
  }
}
