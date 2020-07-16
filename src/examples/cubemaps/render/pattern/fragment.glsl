precision highp float;

uniform vec3 color;

void main() {

  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;


}
