in vec3 position;
in vec2 uv0;

out vec2 v_uv;

void main() {
  v_uv = uv0;
  gl_Position = vec4(position.x, position.y, 0., 1.);

}
