attribute vec3 position;
attribute vec2 uv;

varying vec2 v_uv;

void main() {

  v_uv = uv;
  gl_Position = vec4( position.x, position.y, 0.0, 1. );

}
