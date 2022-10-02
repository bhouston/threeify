//
// basic shader
//
// Authors:
// * @bhouston
//

import { IDisposable } from '../../../core/types';
import { GL } from '../GL';
import { RenderingContext } from '../RenderingContext';
import { ShaderType } from './ShaderType';

function insertLineNumbers(source: string): string {
  const inputLines = source.split('\n');
  const outputLines = ['\n'];
  const maxLineCharacters = Math.floor(Math.log10(inputLines.length));
  for (let l = 0; l < inputLines.length; l++) {
    const lAsString = `000000${l + 1}`.slice(-maxLineCharacters - 1);
    outputLines.push(`${lAsString}: ${inputLines[l]}`);
  }
  return outputLines.join('\n');
}

// This reduces the code bulk when debugging shaders
function removeDeadCode(source: string): string {
  const defineRegexp = /^#define +([\w\d_]+)/;
  const undefRegexp = /^#undef +([\w\d_]+)/;
  const ifdefRegexp = /^#ifdef +([\w\d_]+)/;
  const ifndefRegexp = /^#ifndef +([\w\d_]+)/;
  const endifRegexp = /^#endif.* /;

  // state management
  let defines: string[] = [];
  const liveCodeStack: boolean[] = [true];

  const outputLines: string[] = [];
  source.split('\n').forEach((line) => {
    const isLive = liveCodeStack[liveCodeStack.length - 1];

    if (isLive) {
      const defineMatch = line.match(defineRegexp);
      if (defineMatch !== null) {
        defines.push(defineMatch[1]);
      }
      const undefMatch = line.match(undefRegexp);
      if (undefMatch !== null) {
        const indexOfDefine = defines.indexOf(undefMatch[1]);
        if (indexOfDefine >= 0) {
          defines = defines.splice(indexOfDefine, 1);
        }
      }
      const ifdefMatch = line.match(ifdefRegexp);
      if (ifdefMatch !== null) {
        liveCodeStack.push(defines.indexOf(ifdefMatch[1]) >= 0);
        return;
      }
      const ifndefMatch = line.match(ifndefRegexp);
      if (ifndefMatch !== null) {
        liveCodeStack.push(defines.indexOf(ifndefMatch[1]) < 0);
        return;
      }
    }
    const endifMatch = line.match(endifRegexp);
    if (endifMatch !== null) {
      liveCodeStack.pop();
      return;
    }
    if (isLive) {
      outputLines.push(line);
    }
  });
  return outputLines
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '')
    .replace(/[\r\n]+/g, '\n');
}

export class Shader implements IDisposable {
  readonly id: number;
  disposed = false;
  glShader: WebGLShader;
  #validated = false;
  finalSource: string;

  constructor(
    public context: RenderingContext,
    public source: string,
    public shaderType: ShaderType,
    public glslVersion = 300
  ) {
    const { gl } = this.context;

    // Create the shader object
    {
      const glShader = gl.createShader(shaderType);
      if (glShader === null) {
        throw new Error('createShader failed');
      }

      this.glShader = glShader;
    }

    const prefix = [];
    if (glslVersion === 300) {
      prefix.push('#version 300 es');
    }
    if (shaderType === ShaderType.Fragment) {
      const { glxo } = context;
      if (glxo.EXT_shader_texture_lod !== null) {
        prefix.push('#extension GL_EXT_shader_texture_lod : enable');
      }
      prefix.push('#extension GL_OES_standard_derivatives : enable');
    }
    const combinedSource = `${prefix.join('\n')}\n${source}`;

    this.finalSource = removeDeadCode(combinedSource);

    // Set the shader source code.
    gl.shaderSource(this.glShader, this.finalSource);

    // Compile the shader
    gl.compileShader(this.glShader);

    // NOTE: purposely not checking if this compiled.
    this.id = this.context.registerResource(this);
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
    const { gl } = this.context;
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
      console.error(errorMessage);
      console.error(insertLineNumbers(this.finalSource));
      this.disposed = true;
      throw new Error(errorMessage);
    }
    this.#validated = true;
  }

  dispose(): void {
    if (!this.disposed) {
      this.context.gl.deleteShader(this.glShader);
      this.context.disposeResource(this);
      this.disposed = true;
    }
  }
}
