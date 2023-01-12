precision highp float;

uniform vec3 color;

out vec4 outputColor;

void main() {
  outputColor.rgb = color;
  outputColor.a = 1.0;

}
