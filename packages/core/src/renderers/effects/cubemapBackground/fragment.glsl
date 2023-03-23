precision highp float;

in vec3 v_viewSurfaceNormal;

uniform samplerCube cubeMap;
uniform float cubeMapIntensity;
uniform bool toneMapping;
uniform float exposure;
uniform bool sRGB;

#pragma import "../../../shaders/color/tonemapping/acesfilmic.glsl"
#pragma import "../../../shaders/color/spaces/srgb.glsl"

out vec4 outputColor;

void main() {
  vec3 viewSurfaceNormal = normalize(v_viewSurfaceNormal);

  outputColor = texture(cubeMap, viewSurfaceNormal, 0.0) * cubeMapIntensity;

  outputColor.rgb *= exposure;
  if (toneMapping) {
    outputColor.rgb = tonemappingACESFilmic(outputColor.rgb);
  }
  if (sRGB) {
    outputColor.rgb = linearTosRGB(outputColor.rgb);
  }
  outputColor.a = 1.0;
}
