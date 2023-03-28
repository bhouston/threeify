//
// basic shader
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../../../core/generateUuid.js';
import { GL } from '../GL.js';
import { IResource } from '../IResource.js';
import { RenderingContext } from '../RenderingContext.js';
import { ShaderDefines } from './ShaderDefines.js';
import {
  addErrorSnippetsToCompilerOutput,
  insertLineNumbers,
  parseCompilerOutput,
  removeDeadCode
} from './ShaderSourceTools.js';
import { ShaderType } from './ShaderType.js';

export class Shader implements IResource {
  public readonly id = generateUUID();
  public disposed = false;
  public readonly glShader: WebGLShader;
  #validated = false;
  finalSource: string;

  constructor(
    public readonly context: RenderingContext,
    public readonly name: string,
    public readonly source: string,
    public readonly shaderType: ShaderType,
    public readonly shaderDefines: ShaderDefines = {}
  ) {
    const { gl, resources } = this.context;

    // Create the shader object
    {
      const glShader = gl.createShader(shaderType);
      if (glShader === null) {
        throw new Error('createShader failed');
      }

      this.glShader = glShader;
    }

    const prefix = [];
    prefix.push('#version 300 es');
    Object.keys(this.shaderDefines).forEach((key) => {
      const value = this.shaderDefines[key];
      prefix.push(`#define ${key} ${value}`);
    });

    const combinedSource = `${prefix.join('\n')}\n${source}`;

    this.finalSource = removeDeadCode(combinedSource);

    // Set the shader source code.
    gl.shaderSource(this.glShader, this.finalSource);

    // Compile the shader
    gl.compileShader(this.glShader);

    resources.register(this);
  }

  get translatedSource(): string {
    const ds = this.context.glxo.WEBGL_debug_shaders;
    if (ds !== null) {
      return ds.getTranslatedShaderSource(this.glShader);
    }
    return '';
  }

  validate(): void {
    if (this.#validated || this.disposed) {
      return;
    }
    // This is only done if necessary and delayed per best practices here:
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#Compile_Shaders_and_Link_Programs_in_parallel
    const { gl, resources } = this.context;
    // Check if it compiled
    const compileStatus = gl.getShaderParameter(
      this.glShader,
      GL.COMPILE_STATUS
    );
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!compileStatus) {
      // Something went wrong during compilation; get the error
      const infoLog = gl.getShaderInfoLog(this.glShader);
      const errorMessage = `could not compile shader:\n${infoLog}`;
      const compilerOutput = parseCompilerOutput(errorMessage);
      const shaderSourceWithLineNumbers = insertLineNumbers(
        this.finalSource,
        this.name,
        this.shaderType
      );
      addErrorSnippetsToCompilerOutput(
        compilerOutput,
        shaderSourceWithLineNumbers
      );
      for (const output of compilerOutput) {
        if (output.type === 'WARNING') {
          console.warn(output.codeSnippet);
        } else if (output.type === 'ERROR') {
          console.error(output.codeSnippet);
        } else {
          console.log(output.message);
        }
      }
      resources.unregister(this);
      this.disposed = true;
      throw new Error(errorMessage);
    }
    this.#validated = true;
  }

  dispose(): void {
    if (this.disposed) return;

    const { gl, resources } = this.context;
    gl.deleteShader(this.glShader);
    resources.unregister(this);
    this.disposed = true;
  }
}
