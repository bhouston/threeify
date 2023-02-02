// TODO: uncomment the extensions once support is added for them in core.

// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_parallel_shader_compile {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  MAX_SHADER_COMPILER_THREADS_KHR = 0x91b0;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  COMPLETION_STATUS_KHR = 0x91b1;
}

// TODO: This is definitely not the way to do this, but I do not know the right way. -Ben 2023-02-02
export class EXT_disjoint_timer_query_webgl2 {
  QUERY_COUNTER_BITS_EXT = 0x8864;
  TIME_ELAPSED_EXT = 0x88bf;
  TIMESTAMP_EXT = 0x8e28;
  GPU_DISJOINT_EXT = 0x8fbb;
}

/* eslint-disable @typescript-eslint/naming-convention */
export class OptionalExtensions {
  EXT_disjoint_timer_query_webgl2: EXT_disjoint_timer_query_webgl2 | null;
  EXT_texture_filter_anisotropic: EXT_texture_filter_anisotropic | null;
  KHR_parallel_shader_compile: KHR_parallel_shader_compile | null;
  // OES_texture_float_linear: OES_texture_float_linear | null;
  // OES_texture_half_float_linear: OES_texture_half_float_linear | null;
  WEBGL_debug_renderer_info: WEBGL_debug_renderer_info | null;
  WEBGL_debug_shaders: WEBGL_debug_shaders | null;
  // WEBGL_compressed_texture_astc: WEBGL_compressed_texture_astc | null;
  // WEBGL_compressed_texture_s3tc: WEBGL_compressed_texture_s3tc | null;
  // WEBGL_compressed_texture_s3tc_srgb: WEBGL_compressed_texture_s3tc_srgb | null;

  constructor(gl: WebGL2RenderingContext) {
    this.EXT_disjoint_timer_query_webgl2 =
      gl.getExtension('EXT_disjoint_timer_query_webgl2') !== null
        ? new EXT_disjoint_timer_query_webgl2()
        : null;
    this.EXT_texture_filter_anisotropic = gl.getExtension(
      'EXT_texture_filter_anisotropic'
    );
    this.KHR_parallel_shader_compile =
      gl.getExtension('KHR_parallel_shader_compile') !== null
        ? new KHR_parallel_shader_compile()
        : null;
    // this.OES_texture_float_linear = gl.getExtension("OES_texture_float_linear");
    // this.OES_texture_half_float_linear = gl.getExtension("OES_texture_half_float_linear");
    this.WEBGL_debug_renderer_info = gl.getExtension(
      'WEBGL_debug_renderer_info'
    );
    this.WEBGL_debug_shaders = gl.getExtension('WEBGL_debug_shaders');
    // this.WEBGL_compressed_texture_astc = gl.getExtension("WEBGL_compressed_texture_astc");
    // this.WEBGL_compressed_texture_s3tc = gl.getExtension("WEBGL_compressed_texture_s3tc");
    // this.WEBGL_compressed_texture_s3tc_srgb = gl.getExtension("WEBGL_compressed_texture_s3tc_srgb");
  }
}
