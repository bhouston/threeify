in vec3 position;
in vec2 uv0;

out vec3 v_position;
out vec2 v_uv0;

void main() {
  v_position = position;
  v_uv0 = uv0;

  gl_Position = vec4(position, 1.0);

}
