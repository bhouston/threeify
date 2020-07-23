attribute vec3 position;
attribute vec2 uv;

varying vec2 v_uv;
varying vec3 v_position;

void main() {

  v_position = position;
  v_uv = uv;

  gl_Position = vec4( position, 1. );

}
