precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv;

uniform samplerCube cubeMap;

out vec4 outputColor;

void main() {
  vec3 reflectDir = reflect( normalize( v_viewSurfacePosition ),normalize(v_viewSurfaceNormal) );
  outputColor = texture(cubeMap, reflectDir);

  outputColor.a = 1.;

}
