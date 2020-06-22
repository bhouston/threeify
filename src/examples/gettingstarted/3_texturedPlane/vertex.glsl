in vec3 position;
in vec2 uv;

out vec2 v_texCoord;

void main() {

  v_texCoord = uv;
  gl_Position = vec4( position.x, position.y, 0.5, 1.0 );

}
