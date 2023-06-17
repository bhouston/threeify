//
// basic shader
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../../../core/generateUuid';
import { GL } from '../GL';
import { IResource } from '../IResource';
import { RenderingContext } from '../RenderingContext';
import { ShaderDefines } from './ShaderDefines';
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
  const defineRegexp = /^#define +(\w+)/;
  const undefRegexp = /^#undef +(\w+)/;
  const ifdefRegexp = /^#ifdef +(\w+)/;
  const ifndefRegexp = /^#ifndef +(\w+)/;
  const endifRegexp = /^#endif.* /;

  // state management
  let defines: string[] = [];
  const liveCodeStack: boolean[] = [true];

  const outputLines: string[] = [];
  source.split('\n').forEach((line) => {
    const isLive = liveCodeStack.at(-1);

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
        liveCodeStack.push(defines.includes(ifdefMatch[1]));
        return;
      }
      const ifndefMatch = line.match(ifndefRegexp);
      if (ifndefMatch !== null) {
        liveCodeStack.push(!defines.includes(ifndefMatch[1]));
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
    .replace(/\/\*[\S\s]*?\*\/|([^:\\]|^)\/\/.*$/gm, '')
    .replace(/[\n\r]+/g, '\n');
}

export class Shader implements IResource {
  public readonly id = generateUUID();
  public disposed = false;
  public readonly glShader: WebGLShader;
  #validated = false;
  finalSource: string;

  constructor(
    public readonly context: RenderingContext,
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
      console.error(errorMessage);
      console.error(insertLineNumbers(this.finalSource));
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
