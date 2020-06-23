// TODO: uncomment the extensions once support is added for them in core.

/* eslint-disable @typescript-eslint/naming-convention */
export class OptionalExtensions {
  // https://developer.mozilla.org/en-US/docs/Web/API/EXT_frag_depth
  // EXT_frag_depth: EXT_frag_depth | null;
  // https://developer.mozilla.org/en-US/docs/Web/API/EXT_sRGB
  // EXT_sRGB: EXT_sRGB | null;
  // https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_filter_anisotropic
  EXT_texture_filter_anisotropic: EXT_texture_filter_anisotropic | null;
  // https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float
  // OES_texture_float: OES_texture_float | null;
  // https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float_linear
  // OES_texture_float_linear: OES_texture_float_linear | null;
  // https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float
  // OES_texture_half_float: OES_texture_half_float | null;
  // https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float_linear
  // OES_texture_half_float_linear: OES_texture_half_float_linear | null;
  // https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_color_buffer_float
  // WEBGL_color_buffer_float: WEBGL_color_buffer_float | null;
  // https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info
  WEBGL_debug_renderer_info: WEBGL_debug_renderer_info | null;
  // https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_shaders
  WEBGL_debug_shaders: WEBGL_debug_shaders | null;
  // https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_draw_buffers
  // WEBGL_draw_buffers: WEBGL_draw_buffers | null;
  // https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc
  // WEBGL_compressed_texture_astc: WEBGL_compressed_texture_astc | null;
  // https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc
  // WEBGL_compressed_texture_s3tc: WEBGL_compressed_texture_s3tc | null;
  // https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc_srgb
  // WEBGL_compressed_texture_s3tc_srgb: WEBGL_compressed_texture_s3tc_srgb | null;

  constructor(gl: WebGLRenderingContext) {
    // this.EXT_frag_depth = gl.getExtension("EXT_frag_depth");
    // this.EXT_sRGB = gl.getExtension("EXT_sRGB");
    this.EXT_texture_filter_anisotropic = gl.getExtension("EXT_texture_filter_anisotropic");
    // this.OES_texture_float = gl.getExtension("OES_texture_float");
    // this.OES_texture_float_linear = gl.getExtension("OES_texture_float_linear");
    // this.OES_texture_half_float = gl.getExtension("OES_texture_half_float");
    // this.OES_texture_half_float_linear = gl.getExtension("OES_texture_half_float_linear");
    // this.WEBGL_color_buffer_float = gl.getExtension("WEBGL_color_buffer_float");
    this.WEBGL_debug_renderer_info = gl.getExtension("WEBGL_debug_renderer_info");
    this.WEBGL_debug_shaders = gl.getExtension("WEBGL_debug_shaders");
    // this.WEBGL_draw_buffers = gl.getExtension("WEBGL_draw_buffers");
    // this.WEBGL_compressed_texture_astc = gl.getExtension("WEBGL_compressed_texture_astc");
    // this.WEBGL_compressed_texture_s3tc = gl.getExtension("WEBGL_compressed_texture_s3tc");
    // this.WEBGL_compressed_texture_s3tc_srgb = gl.getExtension("WEBGL_compressed_texture_s3tc_srgb");
  }
}
