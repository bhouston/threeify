attribute vec3 position;
attribute vec2 uv;

varying vec2 v_uv;

uniform mat4 localToWorld;

void main() {

  v_uv = uv;
  gl_Position = localToWorld * vec4( position.x, position.y, 0.0, 1. );

}
