import { ShaderType } from './ShaderType';

interface CompilerOutput {
  type: string;
  lineNumber: number;
  message: string;
  codeSnippet: string;
}

export function parseCompilerOutput(output: string): CompilerOutput[] {
  const lines = output.split('\n');
  const results: CompilerOutput[] = [];

  for (const line of lines) {
    const tokens = line.split(':');
    if (tokens.length < 4) {
      results.push({
        type: 'OTHER',
        lineNumber: -1,
        message: line,
        codeSnippet: ''
      });
      continue; // not a valid compile result
    }

    const type = tokens[0].trim();
    const lineNumber = Number.parseInt(tokens[2].trim());
    const message = tokens.slice(3).join(':').trim();

    results.push({ type, lineNumber, message, codeSnippet: '' });
  }

  return results;
}

export function addErrorSnippetsToCompilerOutput(
  compileResults: CompilerOutput[],
  shaderCode: string
) {
  for (const compileResult of compileResults) {
    const { lineNumber, message } = compileResult;
    if (lineNumber < 0) continue;

    const snippetStart = Math.max(0, lineNumber - 4); // include 5 lines before the error
    const snippetEnd = lineNumber + 5; // include 5 lines after the error

    const splitCode = shaderCode.split('\n').splice(2);

    const snippetLines = [
      ...splitCode.slice(snippetStart, lineNumber - 1),
      '',
      splitCode[lineNumber - 1],
      '',
      ...splitCode.slice(lineNumber, snippetEnd)
    ];
    const formattedSnippet = `${
      compileResult.type
    } (${lineNumber}): ${message}\n${snippetLines.join('\n')}\n`;
    compileResult.codeSnippet = formattedSnippet;
  }
}

export function insertLineNumbers(
  source: string,
  shaderName: string,
  shaderType: ShaderType
): string {
  const inputLines = source.split('\n');
  const outputLines = ['\n'];
  const maxLineCharacters = Math.floor(Math.log10(inputLines.length));
  for (let l = 0; l < inputLines.length; l++) {
    const lAsString = `000000${l + 1}`.slice(-maxLineCharacters - 1);
    outputLines.push(
      `${name}:${ShaderType[shaderType]}:${lAsString}: ${inputLines[l]}`
    );
  }
  return outputLines.join('\n');
}

// This reduces the code bulk when debugging shaders
export function removeDeadCode(source: string): string {
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
