in vec3 position;
in vec2 uv;

out vec2 v_uv;

void main() {

  v_uv = uv;
  gl_Position = vec4( position.x, position.y, 0.0, 1. );

}
