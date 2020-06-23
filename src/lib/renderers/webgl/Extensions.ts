/* eslint-disable @typescript-eslint/naming-convention */
export class WebGLRenderContextExtensions {
  ANGLE_instance_array: ANGLE_instanced_arrays;
  EXT_blend_minmax: EXT_blend_minmax;
  OES_element_index_uint: OES_element_index_uint;
  OES_standard_derivatives: OES_standard_derivatives;
  WEBGL_depth_texture: WEBGL_depth_texture;
  OES_vertex_array_object: OES_vertex_array_object;
  EXT_shader_texture_lod: EXT_shader_texture_lod;

  constructor(gl: WebGLRenderingContext) {
    // TODO: use some smart generics to simplify this repetitive code
    const ANGLE_instance_array = gl.getExtension("ANGLE_instanced_arrays"); // 98% support
    if (ANGLE_instance_array === null) {
      throw new Error("required extension 'ANGLE_instance_array' not supported");
    }
    this.ANGLE_instance_array = ANGLE_instance_array;

    const EXT_blend_minmax = gl.getExtension("EXT_blend_minmax"); // 98% support
    if (EXT_blend_minmax === null) {
      throw new Error("required extension 'EXT_blend_minmax' not supported");
    }
    this.EXT_blend_minmax = EXT_blend_minmax;

    const OES_element_index_uint = gl.getExtension("OES_element_index_uint"); // 98% support
    if (OES_element_index_uint === null) {
      throw new Error("required extension 'OES_element_index_uint' not supported");
    }
    this.OES_element_index_uint = OES_element_index_uint;

    const OES_standard_derivatives = gl.getExtension("OES_standard_derivatives"); // 100% support
    if (OES_standard_derivatives === null) {
      throw new Error("required extension 'OES_standard_derivatives' not supported");
    }
    this.OES_standard_derivatives = OES_standard_derivatives;

    const OES_vertex_array_object = gl.getExtension("OES_vertex_array_object"); // 98% support
    if (OES_vertex_array_object === null) {
      throw new Error("required extension 'OES_vertex_array_object' not supported");
    }
    this.OES_vertex_array_object = OES_vertex_array_object;

    const WEBGL_depth_texture = gl.getExtension("WEBGL_depth_texture"); // 91% support
    if (WEBGL_depth_texture === null) {
      throw new Error("required extension 'WEBGL_depth_texture' not supported");
    }
    this.WEBGL_depth_texture = WEBGL_depth_texture;

    // TODO: make this optional at some point.
    const EXT_shader_texture_lod = gl.getExtension("EXT_shader_texture_lod"); //  <80% support
    if (EXT_shader_texture_lod === null) {
      throw new Error("required extension 'EXT_shader_texture_lod' not supported");
    }
    this.EXT_shader_texture_lod = EXT_shader_texture_lod;
  }
}
