#pragma once
#pragma include <microgeometry/normalPacking>
#pragma include <math/unitIntervalPacking>

#define OUTPUT_CHANNEL_BEAUTY (0)

#define OUTPUT_CHANNEL_ALBEDO (1)
#define OUTPUT_CHANNEL_METALNESS (2)
#define OUTPUT_CHANNEL_ROUGHNESS (3)
#define OUTPUT_CHANNEL_OCCLUSION (4)
#define OUTPUT_CHANNEL_EMISSIVE (5)

#define OUTPUT_CHANNEL_NORMAL (6)
#define OUTPUT_CHANNEL_DEPTH (7)

#define OUTPUT_CHANNEL_AMBIENT (8)
#define OUTPUT_CHANNEL_DIFFUSE (9)
#define OUTPUT_CHANNEL_SPECULAR (10)

#define OUTPUT_CHANNEL_DEPTH_PACKED (11)
#define OUTPUT_CHANNEL_METALNESS_ROUGHNESS_OCCLUSION (12)

struct OutputChannels {
  // main
  vec3 beauty;

  // material properties
  vec3 albedo;
  float alpha;
  float metalness;
  float roughness;
  float occlusion;
  vec3 emissive;

  // geometry
  vec3 normal;
  float clipDepth;

  // lighting
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};

void writeOutputChannels(
  const OutputChannels outputChannels,
  const int outputChannelSelector
) {
  vec4 result = vec4(0.0, 0.0, 0.0, 1.0);

  if (outputChannelSelector == OUTPUT_CHANNEL_BEAUTY) {
    result.rgb = outputChannels.beauty;
  } else if (outputChannelSelector == OUTPUT_CHANNEL_ALBEDO) {
    result.rgb = outputChannels.albedo;
    result.a = outputChannels.alpha;
  } else if (outputChannelSelector == OUTPUT_CHANNEL_METALNESS) {
    result.r = outputChannels.metalness;
  } else if (outputChannelSelector == OUTPUT_CHANNEL_ROUGHNESS) {
    result.g = outputChannels.roughness;
  } else if (outputChannelSelector == OUTPUT_CHANNEL_OCCLUSION) {
    result.b = outputChannels.occlusion;
  } else if (outputChannelSelector == OUTPUT_CHANNEL_EMISSIVE) {
    result.rgb = outputChannels.albedo;
  } else if (outputChannelSelector == OUTPUT_CHANNEL_NORMAL) {
    result.rgb = normalToRgb(outputChannels.normal);
  } else if (outputChannelSelector == OUTPUT_CHANNEL_DEPTH) {
    result.rgb = vec3(outputChannels.clipDepth);
  } else if (outputChannelSelector == OUTPUT_CHANNEL_AMBIENT) {
    result.rgb = outputChannels.ambient;
  } else if (outputChannelSelector == OUTPUT_CHANNEL_DIFFUSE) {
    result.rgb = outputChannels.diffuse;
  } else if (outputChannelSelector == OUTPUT_CHANNEL_SPECULAR) {
    result.rgb = outputChannels.specular;
  } else if (
    outputChannelSelector ==
    OUTPUT_CHANNEL_METALNESS_ROUGHNESS_OCCLUSION
  ) {
    result.r = outputChannels.metalness;
    result.g = outputChannels.roughness;
    result.b = outputChannels.occlusion;
  } else if (outputChannelSelector == OUTPUT_CHANNEL_DEPTH_PACKED) {
    result.rgba = unitIntervalToVec4(outputChannels.clipDepth);
  }

  gl_FragColor = result;
}
