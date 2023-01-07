precision highp float;

in vec3 v_viewPosition;
in vec3 v_viewNormal;

uniform samplerCube cubeMap;
uniform float perceptualRoughness;
uniform int mipCount;

out vec4 outputColor;

void main() {

  vec3 reflectDir = reflect( normalize( v_viewPosition ),normalize(v_viewNormal) );
  float lod = clamp(perceptualRoughness * float(mipCount), 0., float(mipCount));
  outputColor = textureCubeLodEXT(cubeMap, reflectDir, lod);

}
