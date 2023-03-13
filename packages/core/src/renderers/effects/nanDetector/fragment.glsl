precision highp float;

in vec2 v_uv0;

uniform sampler2D sourceMap;

out vec4 outputColor;

#pragma import "../../../shaders/debug/nanDetector.glsl"

void main() {
  vec4 sourceColor = texture(sourceMap, v_uv0);

  vec4 result;
  nanDetector( sourceColor, out result );
  outputColor = result;
}
