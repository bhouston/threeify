precision highp float;

#pragma include <math/mat4>

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv;

uniform mat4 localToWorld;

uniform samplerCube cubeMap;
uniform float perceptualRoughness;
uniform int mipCount;

out vec4 outputColor;


void main() {
 /* vec3 reflectDir = reflect(
    normalize(v_viewSurfacePosition),
    normalize(v_viewSurfaceNormal)
  );*/
  float lod = clamp(
    perceptualRoughness * float(mipCount),
    0.,
    float(mipCount)
  );
  outputColor.xyz = texture(cubeMap, mat4UntransformDirection( localToWorld, v_viewSurfaceNormal)).xyz;
  outputColor.a = 1.;

}
