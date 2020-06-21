precision highp float;

uniform samplerCube cubeMap;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;

void main() {

  vec3 reflectDir = reflect( normalize( v_viewPosition ),normalize(v_viewNormal) );
  gl_FragColor = textureCube(cubeMap, reflectDir);

}
