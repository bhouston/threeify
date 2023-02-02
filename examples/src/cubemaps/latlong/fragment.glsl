precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv;

uniform samplerCube cubeMap;
uniform float perceptualRoughness;
uniform int mipCount;

out vec4 outputColor;

void main() {
  vec3 reflectDir = reflect( normalize( v_viewSurfacePosition ),normalize(v_viewSurfaceNormal) );
  float lod = clamp(
    perceptualRoughness * float(mipCount),
    0.0,
    float(mipCount)
  );
  outputColor.xyz = texture(cubeMap, reflectDir).xyz;
  outputColor.a = 1.;

}
