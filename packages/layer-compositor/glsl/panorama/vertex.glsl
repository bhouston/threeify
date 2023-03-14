attribute vec3 position;
attribute vec2 uv;

uniform mat4 localToView;
uniform mat4 viewToClip;

varying vec2 v_uv;

void main() {
  vec4 viewPos = localToView * vec4(position, 1.0);

  gl_Position = viewToClip * viewPos;

  v_uv = uv;

}
