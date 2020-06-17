precision highp float;

uniform sampler2D map;

varying vec2 v_texCoord;

void main() {

  gl_FragColor = texture2D(map, v_texCoord);

}
