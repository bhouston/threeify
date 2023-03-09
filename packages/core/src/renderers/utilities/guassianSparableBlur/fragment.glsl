precision highp float;

#pragma import "@threeify/core/dist/shaders/color/tonemapping/acesfilmic.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"
#pragma import "@threeify/core/dist/shaders/math/sampling/guassian.glsl"

in vec2 v_uv0;

uniform float standardDeviation; // The standard deviation of the Gaussian filter
uniform sampler2D textureMap; // The input texture
uniform vec2 direction; // The direction of the blur
uniform int kernalRadius; // The radius of the blur
out vec4 outputColor;

void main() {
  ivec2 size = textureSize(textureMap, 0);
  vec2 texSize = vec2(float(size.x), float(size.y));
  vec2 texelToUVSpace = 1.0 / texSize;
  
  float weightSum = gaussianPdf( 0.0, standardDeviation );
  vec3 colorSum = texture( textureMap, vUv).rgb * weightSum;

  for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
      float x = float( i );
      float weight = gaussianPdf( x, standardDeviation );
      vec2 uvOffset = direction * texelToUVSpace * x;
      colorSum += ( texture( textureMap, v_uv0 + uvOffset).rgb + texture( textureMap, v_uv0 - uvOffset).rgb ) * weight;
      weightSum += 2.0 * weight;
  }


  vec4 color = vec4( colorSum / weightSum, 1.0 );
  outputColor.rgb = color.rgb; 
  outputColor.a = 1.0;
}
