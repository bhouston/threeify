precision highp float;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;

uniform samplerCube cubeMap;
uniform float perceptualRoughness;
uniform int mipCount;

#pragma include <color/encodings/rgbd>

void main() {

  vec3 reflectDir = reflect( normalize( v_viewPosition ),normalize(v_viewNormal) );
  float lod = clamp(perceptualRoughness * float(mipCount), 0., float(mipCount));
  gl_FragColor.rgb = pow( rgbdToLinear(textureCubeLodEXT(cubeMap, reflectDir, lod),16.), vec3(0.5) );

  gl_FragColor.a = 1.;

}
