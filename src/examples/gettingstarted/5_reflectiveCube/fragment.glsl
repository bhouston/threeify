precision highp float;

uniform samplerCube cubeMap;

varying vec3 v_viewNormal;

void main() {

  vec3 cubeIntensity = textureCube(cubeMap, normalize(v_viewNormal)).rgb;
  gl_FragColor = vec4( cubeIntensity, 1.0);

}
