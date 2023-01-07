export function getParameterAsString(
  gl: WebGL2RenderingContext,
  parameterId: number,
  result = ''
): string {
  const text = gl.getParameter(parameterId);
  if (typeof text === 'string') {
    result = text;
  }
  return result;
}
