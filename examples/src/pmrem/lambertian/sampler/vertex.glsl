in vec3 position;
in vec2 uv;

out vec3 v_position;
out vec2 v_uv;

void main() {
  v_position = position;
  v_uv = uv;

  gl_Position = vec4(position, 1.0);

}
