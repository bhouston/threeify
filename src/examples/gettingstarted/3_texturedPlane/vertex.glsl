attribute vec3 position;
attribute vec2 uv;

varying vec2 v_texCoord;

void main() {

  v_texCoord = uv;
  gl_Position = vec4( position.y, position.x, 0.5, 1.0 );

}
