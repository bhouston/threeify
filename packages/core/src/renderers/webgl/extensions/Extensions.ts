// TODO: uncomment the extensions once support is added for them in core.

/*function getRequiredExtension<T>(
  gl: WebGL2RenderingContext,
  extensionName: string
): T {
  const ext = gl.getExtension(extensionName);
  if (ext === null) {
    throw new Error(`required extension ${extensionName} not available.`);
  }
  return ext as T;
}*/

/* eslint-disable @typescript-eslint/naming-convention */
export class Extensions {
  // WEBGL_lose_context: WEBGL_lose_context;

  constructor(_gl: WebGL2RenderingContext) {
    // this.WEBGL_lose_context = getRequiredExtension( gl, "WEBGL_lose_context"); // 98% support
  }
}
