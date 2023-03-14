precision highp float;

in vec2 v_uv0;

uniform sampler2D sourceMap;
uniform float exposure;

out vec4 outputColor;

#pragma import "../../../shaders/color/tonemapping/acesfilmic.glsl"
#pragma import "../../../shaders/color/spaces/srgb.glsl"

void main() {
  vec4 sourceColor = texture(sourceMap, v_uv0);
  vec3 tonemapped = tonemappingACESFilmic(sourceColor.rgb * exposure);
  vec3 sRGB = linearTosRGB(tonemapped);

  outputColor.rgb = sRGB;
  outputColor.a = sourceColor.a;
}
