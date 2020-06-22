precision highp float;

in vec3 v_viewPosition;
in vec3 v_viewNormal;

uniform samplerCube cubeMap;

out vec4 fragColor;

void main() {

  vec3 reflectDir = reflect( normalize( v_viewPosition ),normalize(v_viewNormal) );
  fragColor = texture(cubeMap, reflectDir);

}
