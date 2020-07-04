attribute vec3 position;
attribute vec2 uv;

varying vec2 v_texCoord;

void main() {

  v_texCoord = uv;
  gl_Position = vec4( position.x, position.y, 0.5, 1. );

}
