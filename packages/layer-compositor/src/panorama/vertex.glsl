attribute vec3 position;
attribute vec2 uv;

uniform mat4 localToView;
uniform mat4 viewToScreen;

varying vec2 v_uv;

void main() {
  vec4 viewPos = localToView * vec4(position, 1.);

  gl_Position = viewToScreen * viewPos;

  v_uv = uv;

}
