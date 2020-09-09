precision highp float;

uniform sampler2D layerMap;
uniform float mipmapBias;
uniform int premultipledAlpha;

uniform vec2 layerUVScale;

uniform mat3 uvToTexture;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;

#pragma include <color/spaces/srgb>

void main() {
  vec3 outputColor = vec3(0.);
  vec2 texelUv = ( uvToTexture * vec3( v_uv, 1.0 ) ).xy;
  vec4 layerColor = texture2D( layerMap, texelUv, mipmapBias );
  outputColor += sRGBToLinear( layerColor.rgb );

  gl_FragColor.rgb = linearTosRGB( outputColor );
  if( premultipledAlpha == 1 ) {
    gl_FragColor.rgb *= layerColor.a;
  }
  gl_FragColor.a = layerColor.a;

}
