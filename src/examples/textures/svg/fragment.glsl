precision highp float;

varying vec2 v_uv;

uniform sampler2D map;

void main() {

  gl_FragColor = texture2D(map, v_uv);

}
