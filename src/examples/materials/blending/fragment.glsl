precision highp float;

varying vec2 v_uv;

uniform sampler2D map;
uniform int premultipliedAlpha;
uniform float alpha;

void main() {

  gl_FragColor = texture2D(map, v_uv);
  gl_FragColor.a *= alpha;
  if( premultipliedAlpha == 1 ) {
    gl_FragColor.xyz *= gl_FragColor.a;
  }

}
