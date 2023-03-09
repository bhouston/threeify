precision highp float;

in vec2 v_uv0;

uniform sampler2D baseMap;
uniform float baseScale;
uniform sampler2D overlapMap;
uniform float overlapScale;
uniform float exposure;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/color/tonemapping/acesfilmic.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"

void main() {
  vec4 combinedColor = texture(baseMap, v_uv0) * baseScale + texture(overlapMap, v_uv0) * overlapScale;
  vec3 tonemapped = tonemappingACESFilmic(combinedColor.rgb * exposure);
  vec3 sRGB = linearTosRGB(tonemapped);
  vec3 premultipliedAlpha = sRGB * combinedColor.a;

  outputColor.rgb = premultipliedAlpha;
  outputColor.a = combinedColor.a;
}
