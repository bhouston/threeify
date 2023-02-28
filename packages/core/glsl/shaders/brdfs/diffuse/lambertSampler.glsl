#pragma import "../../math.glsl"
#pragma import "../../math/sampling/hammersley.glsl"
#pragma import "../../microgeometry/tangentSpace.glsl"

vec3 BRDF_Diffuse_Lambert_SampleDirection(vec2 sampleUv) {
  float phi = PI2 * sampleUv.x;
  float cosTheta = 0.0;
  float sinTheta = 0.0;

  cosTheta = 1.0 - sampleUv.y;
  sinTheta = sqrt(1.0 - cosTheta * cosTheta);

  return normalize(vec3(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta));
}

float BRDF_Diffuse_Lambert_PDF(const vec3 normal, const vec3 lightDirection) {
  float NdotL = saturate(dot(normal, lightDirection));
  return NdotL * RECIPROCAL_PI;
}

vec4 sampleIBL(vec3 direction, float lod);

#define NUM_SAMPLES (1024)
#define LOD_BIAS (1.0)

vec3 BRDF_Diffuse_Lambert_Filter(vec3 N, float filterWidth) {
  vec4 color;
  float solidAngleTexel = 4.0 * PI / (6.0 * pow2(filterWidth));

  for (int i = 0; i < NUM_SAMPLES; i++) {
    vec2 sampleUv = hammersley2(i, NUM_SAMPLES);
    vec3 tangentSpaceSampleDirection = BRDF_Diffuse_Lambert_SampleDirection(
      sampleUv
    );
    vec3 surfaceSampleDirection =
      tangentToViewFromNormal(N) * tangentSpaceSampleDirection;
    vec3 H = surfaceSampleDirection;

    // Note: reflect takes incident vector.
    // Note: N = V
    vec3 V = N;
    vec3 L = normalize(reflect(-V, H));

    float NdotL = dot(N, L);

    if (NdotL > 0.0) {
      float lod = 0.0;

      // Mipmap Filtered Samples
      // see https://github.com/derkreature/IBLBaker
      // see https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch20.html
      float pdf = BRDF_Diffuse_Lambert_PDF(N, L);

      float solidAngleSample = 1.0 / (float(NUM_SAMPLES) * pdf);

      lod = 0.5 * log2(solidAngleSample / solidAngleTexel);
      lod += LOD_BIAS;

      color += sampleIBL(H, lod);
    }
  }

  return color.rgb / color.w;
}
