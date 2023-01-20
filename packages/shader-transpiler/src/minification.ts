export function stripComments(source: string): string {
  const commentRegex = /\/\*[\S\s]*?\*\/|([^:\\]|^)\/\/.*$/gm; // https://stackoverflow.com/a/15123777
  return source.replace(commentRegex, '');
}

export function stripUnnecessaryLineEndings(source: string): string {
  return source.replace(/[\n\r]+/g, '\n');
}

export function stripUnnecessarySpaces(source: string): string {
  const specialChars = '(),=;+-*/&|%~.:[]?'.split('');

  // remove duplicated spaces
  source = source.replace(/[\t ]+/g, ' ');

  // remove spaces between symbols that do not need to be separated
  for (let i = 0; i < specialChars.length; i++) {
    let lastLength = 0;
    // TODO: Fix this horribly inefficient algorithm
    while (lastLength !== source.length) {
      lastLength = source.length;
      source = source.replace(specialChars[i] + ' ', specialChars[i]);
      source = source.replace(' ' + specialChars[i], specialChars[i]);
    }
  }
  return source;
}
