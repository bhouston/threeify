precision highp float;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;

uniform samplerCube cubeMap;
uniform float perceptualRoughness;
uniform int mipCount;

void main() {

  vec3 reflectDir = reflect( normalize( v_viewPosition ),normalize(v_viewNormal) );
  float lod = clamp(perceptualRoughness * float(mipCount), 0., float(mipCount));
  gl_FragColor = textureCubeLodEXT(cubeMap, reflectDir, lod);

}
