/* eslint-disable @typescript-eslint/naming-convention */
export class Extensions {
  ANGLE_instance_array: ANGLE_instanced_arrays;
  EXT_blend_minmax: EXT_blend_minmax;
  OES_element_index_uint: OES_element_index_uint;
  OES_standard_derivatives: OES_standard_derivatives;
  WEBGL_depth_texture: WEBGL_depth_texture;
  WEBGL_lose_context: WEBGL_lose_context;
  OES_vertex_array_object: OES_vertex_array_object;
  EXT_shader_texture_lod: EXT_shader_texture_lod;

  constructor(gl: WebGLRenderingContext) {
    const ia = gl.getExtension("ANGLE_instanced_arrays"); // 98% support
    const bm = gl.getExtension("EXT_blend_minmax"); // 98% support
    const eiu = gl.getExtension("OES_element_index_uint"); // 98% support
    const sd = gl.getExtension("OES_standard_derivatives"); // 100% support
    const vao = gl.getExtension("OES_vertex_array_object"); // 98% support
    const lc = gl.getExtension("WEBGL_lose_context"); // 98% support
    const dt = gl.getExtension("WEBGL_depth_texture"); // 91% support
    const stl = gl.getExtension("EXT_shader_texture_lod"); //  <80% support

    if (
      ia === null ||
      bm === null ||
      eiu === null ||
      sd === null ||
      vao === null ||
      lc === null ||
      dt === null ||
      stl === null
    ) {
      throw new Error("required extension(s) not supported");
    }

    this.ANGLE_instance_array = ia;
    this.EXT_blend_minmax = bm;
    this.OES_element_index_uint = eiu;
    this.OES_standard_derivatives = sd;
    this.OES_vertex_array_object = vao;
    this.WEBGL_lose_context = lc;
    this.WEBGL_depth_texture = dt;
    this.EXT_shader_texture_lod = stl; // TODO: maybe make this one optional at some point?
  }
}
