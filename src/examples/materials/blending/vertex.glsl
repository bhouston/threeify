in vec3 position;
in vec2 uv;

out vec2 v_uv;

uniform mat4 localToWorld;

void main() {
  v_uv = uv;
  gl_Position = localToWorld * vec4(position.x, position.y, 0.0, 1.0);

}
