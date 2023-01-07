precision highp float;

in vec3 v_position;
in vec2 v_uv;

uniform samplerCube envCubeMap;
uniform int faceIndex;

#pragma include <cubemaps/cubeFaces>
#pragma include <brdfs/diffuse/lambertSampler>

vec4 sampleIBL(vec3 direction, float lod) {
  return textureCube(envCubeMap, direction, lod);
}
void main() {
  vec3 direction = cubeFaceUVToDirection(faceIndex, v_uv);

  outputColor.rgb = BRDF_Diffuse_Lambert_Filter(direction, 1.0);
  outputColor.a = 1.0;

}
