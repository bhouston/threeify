precision highp float;

varying vec3 v_position;
varying vec2 v_uv;

uniform samplerCube envCubeMap;
uniform int faceIndex;

#pragma include <cubemaps/cubeFaces>
#pragma include <brdfs/diffuse/lambertSampler>

vec4 sampleIBL( vec3 direction, float lod ) {
  return textureCube( envCubeMap, direction, lod );
}
void main() {

  vec3 direction = cubeFaceUVToDirection( faceIndex, v_uv );

  gl_FragColor.rgb = BRDF_Diffuse_Lambert_Filter( direction, 1.0 );
  gl_FragColor.a = 1.0;

}
