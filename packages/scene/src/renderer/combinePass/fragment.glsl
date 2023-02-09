precision highp float;

in vec2 v_uv0;

uniform sampler2D transmissionTexture;
uniform sampler2D opaqueTexture;
uniform float exposure;

out vec4 outputColor;


void main() {
  
  vec4 transmissionColor = texture(transmissionTexture, v_uv0 );
  vec4 opaqueColor = texture(opaqueTexture, v_uv0 );
  
  vec4 combinedColor = opaqueColor * ( 1 - transmissionColor.a ) + transmissionColor;

  vec3 tonemapped = tonemappingACESFilmic(combinedColor.rgb);
  vec3 sRGB = linearTosRGB(tonemapped);
  vec3 premultipledAlpha = sRGB * combinedColor.a;

  outputColor.rgb = premultipliedAlpha;
  outputColor.a = material.alpha;
}
