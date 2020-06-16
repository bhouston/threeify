attribute vec2 position;
attribute vec3 color;

varying vec3 v_color;

void main() {

  v_color = a_color;

  gl_Position = vec4( a_position.x, a_position.y, 0.5, 1.0 );

}
