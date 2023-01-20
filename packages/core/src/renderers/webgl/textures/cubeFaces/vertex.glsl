attribute vec3 position;
attribute vec2 uv0;

varying vec3 v_position;
varying vec2 v_uv;

void main() {
  v_position = position;
  v_uv = uv0;

  gl_Position = vec4(position, 1.0);

}
