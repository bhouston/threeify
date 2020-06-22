precision highp float;

in vec2 v_texCoord;

uniform sampler2D map;

out vec4 fragColor;

void main() {

  fragColor = texture(map, v_texCoord);

}
