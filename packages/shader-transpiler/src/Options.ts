function parseString(token: any, defaultValue: string): string {
  if (token === undefined) {
    return defaultValue;
  }
  if (typeof token === 'string') {
    return token;
  }
  throw new Error(`unhandled string value: "${token}"`);
}

function parseStringArray(token: any, defaultValue: string[]): string[] {
  if (token === undefined) {
    return defaultValue;
  }
  if (typeof token === 'object') {
    const result: string[] = [];
    token.forEach((value: any, index: any) => {
      //console.log(value, index);
      result.push(parseString(value, ''));
    });
    // remove empty values.
    return result.filter((value) => value !== '');
  }
  throw new Error(`unhandled string array value: "${token}"`);
}

function parseBoolean(token: any, defaultValue: boolean): boolean {
  if (token === undefined) {
    return defaultValue;
  }
  if (typeof token === 'boolean') {
    return token;
  }
  if (typeof token === 'string') {
    if (
      token.toLowerCase() === 'true' ||
      token === '1' ||
      token.toLowerCase() === 't'
    ) {
      return true;
    }
    if (
      token.toLowerCase() === 'false' ||
      token === '0' ||
      token.toLowerCase() === 'f'
    ) {
      return false;
    }
  }
  throw new Error(`unhandled boolean value: "${token}"`);
}

function parseInteger(token: any, defaultValue: number): number {
  if (token === undefined) {
    return defaultValue;
  }
  if (typeof token === 'number') {
    return token;
  }
  if (typeof token === 'string') {
    return Number.parseInt(token);
  }
  throw new Error(`unhandled integer value: "${token}"`);
}

export class Options {
  rootDir = '.';
  includeDirs: string[] = [];
  outDir = './dist';
  extensions: string[] = ['glsl'];
  minify = false;
  verboseLevel = 0;
  allowJSIncludes = false;

  safeCopy(json: any) {
    this.rootDir = parseString(json.rootDir, this.rootDir);
    this.includeDirs = parseStringArray(json.includeDirs, this.includeDirs);
    this.outDir = parseString(json.outDir, this.outDir);

    this.extensions.concat(parseStringArray(json.extensions, []));
    this.minify = parseBoolean(json.minify, this.minify);
    this.verboseLevel = parseInteger(json.verboseLevel, this.verboseLevel);
    this.allowJSIncludes = parseBoolean(
      json.allowJSIncludes,
      this.allowJSIncludes
    );
  }
}
