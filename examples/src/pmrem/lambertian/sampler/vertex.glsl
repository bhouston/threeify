in vec3 position;
in vec2 uv0;

out vec3 v_position;
out vec2 v_uv;

void main() {
  v_position = position;
  v_uv = uv0;

  gl_Position = vec4(position, 1.);

}
