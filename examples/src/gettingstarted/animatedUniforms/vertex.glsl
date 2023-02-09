in vec2 position;

uniform float scale;

void main() {
  vec2 scaledPosition = position * scale;

  gl_Position = vec4(scaledPosition, 0.5, 1.);

}
