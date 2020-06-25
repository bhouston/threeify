// TODO: uncomment the extensions once support is added for them in core.

// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_parallel_shader_compile {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  MAX_SHADER_COMPILER_THREADS_KHR = 0x91b0;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  COMPLETION_STATUS_KHR = 0x91b1;
}
/* eslint-disable @typescript-eslint/naming-convention */
export class OptionalExtensions {
  // EXT_frag_depth: EXT_frag_depth | null;
  // EXT_sRGB: EXT_sRGB | null;
  EXT_texture_filter_anisotropic: EXT_texture_filter_anisotropic | null;
  KHR_parallel_shader_compile: KHR_parallel_shader_compile | null;
  // OES_texture_float: OES_texture_float | null;
  // OES_texture_float_linear: OES_texture_float_linear | null;
  // OES_texture_half_float: OES_texture_half_float | null;
  // OES_texture_half_float_linear: OES_texture_half_float_linear | null;
  // WEBGL_color_buffer_float: WEBGL_color_buffer_float | null;
  WEBGL_debug_renderer_info: WEBGL_debug_renderer_info | null;
  WEBGL_debug_shaders: WEBGL_debug_shaders | null;
  // WEBGL_draw_buffers: WEBGL_draw_buffers | null;
  // WEBGL_compressed_texture_astc: WEBGL_compressed_texture_astc | null;
  // WEBGL_compressed_texture_s3tc: WEBGL_compressed_texture_s3tc | null;
  // WEBGL_compressed_texture_s3tc_srgb: WEBGL_compressed_texture_s3tc_srgb | null;

  constructor(gl: WebGLRenderingContext) {
    // this.EXT_frag_depth = gl.getExtension("EXT_frag_depth");
    // this.EXT_sRGB = gl.getExtension("EXT_sRGB");
    this.EXT_texture_filter_anisotropic = gl.getExtension("EXT_texture_filter_anisotropic");
    this.KHR_parallel_shader_compile =
      gl.getExtension("KHR_parallel_shader_compile") !== null ? new KHR_parallel_shader_compile() : null;
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
