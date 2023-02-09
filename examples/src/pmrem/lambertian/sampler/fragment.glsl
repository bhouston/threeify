precision highp float;

in vec3 v_position;
in vec2 v_uv;

uniform samplerCube envCubeMap;
uniform int faceIndex;

#pragma include <cubemaps/cubeFaces>
#pragma include <brdfs/diffuse/lambertSampler>

out vec4 outputColor;

vec4 sampleIBL(vec3 direction, float lod) {
  return textureLod(envCubeMap, direction, lod);
}

void main() {
  vec3 direction = cubeFaceUVToDirection(faceIndex, v_uv);

  outputColor.rgb = BRDF_Diffuse_Lambert_Filter(direction, 1.);
  outputColor.a = 1.;

}
