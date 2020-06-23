precision highp float;

varying vec2 v_texCoord;

uniform sampler2D map;

void main() {

  gl_FragColor = texture2D(map, v_texCoord);

}
