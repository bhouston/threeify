precision highp float;

#pragma include <color/encodings>

in vec2 v_uv0;

uniform sampler2D sourceMap;
uniform int sourceEncoding;
uniform int targetEncoding;

out vec4 outputColor;


void main() {
  
  vec4 sourceColor = texture(sourceMap, v_uv0 );
  
  vec4 linearColor = encodingToLinear( sourceColor, sourceEncoding );
  vec4 targetColor = linearToEncoding( linearColor, targetEncoding );

  outputColor = targetColor;
}
