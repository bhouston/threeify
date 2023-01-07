precision highp float;

in vec2 v_uv;

uniform sampler2D map;
uniform int premultipliedAlpha;
uniform float alpha;

out vec4 outputColor;

void main() {
  outputColor = texture(map, v_uv);
  outputColor.a *= alpha;
  if (premultipliedAlpha == 1) {
    outputColor.xyz *= outputColor.a;
  }

}
