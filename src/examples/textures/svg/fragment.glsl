precision highp float;

in vec2 v_uv;

uniform sampler2D map;

out vec4 outputColor;

void main() {

  outputColor = texture(map, v_uv);

}
