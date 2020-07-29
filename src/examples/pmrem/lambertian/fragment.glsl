precision highp float;


varying vec3 v_objectPosition;
varying vec3 v_viewPosition;
varying vec3 v_viewNormal;

uniform samplerCube cubeMap;

void main() {

  vec3 reflectDir = reflect( normalize( v_viewPosition ),normalize( v_viewNormal ) );
  gl_FragColor = textureCube( cubeMap, normalize( v_objectPosition ) );

}
