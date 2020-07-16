precision highp float;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec3 v_localNormal;

uniform samplerCube cubeMap;

void main() {

  vec3 reflectDir = v_localNormal; //reflect( normalize( v_viewPosition ),normalize(v_viewNormal) );
  gl_FragColor = textureCube(cubeMap, reflectDir);

}
