// TODO: uncomment the extensions once support is added for them in core.

function getRequiredExtension<T>(
  gl: WebGLRenderingContext,
  extensionName: string
): T {
  const ext = gl.getExtension(extensionName);
  if (ext === null) {
    throw new Error(`required extension ${extensionName} not available.`);
  }
  return ext as T;
}

/* eslint-disable @typescript-eslint/naming-convention */
export class Extensions {
  // ANGLE_instance_array: ANGLE_instanced_arrays;
  // EXT_blend_minmax: EXT_blend_minmax;
  OES_element_index_uint: OES_element_index_uint;
  OES_standard_derivatives: OES_standard_derivatives;
  OES_vertex_array_object: OES_vertex_array_object;
  // WEBGL_lose_context: WEBGL_lose_context;
  WEBGL_depth_texture: WEBGL_depth_texture;

  constructor(gl: WebGLRenderingContext) {
    // this.ANGLE_instanced_arrays = getRequiredExtension( gl, "ANGLE_instanced_arrays"); // 98% support
    // this.EXT_blend_minmax = getRequiredExtension( gl, "EXT_blend_minmax"); // 98% support
    this.OES_element_index_uint = getRequiredExtension(
      gl,
      'OES_element_index_uint'
    ); // 98% support
    this.OES_standard_derivatives = getRequiredExtension(
      gl,
      'OES_standard_derivatives'
    ); // 100% support
    this.OES_vertex_array_object = getRequiredExtension(
      gl,
      'OES_vertex_array_object'
    ); // 98% support
    // this.WEBGL_lose_context = getRequiredExtension( gl, "WEBGL_lose_context"); // 98% support
    this.WEBGL_depth_texture = getRequiredExtension(gl, 'WEBGL_depth_texture'); // 91% support
  }
}
