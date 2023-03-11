precision highp float;

#pragma import "@threeify/core/dist/shaders/color/tonemapping/acesfilmic.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"

in vec2 v_uv0;

uniform float standardDeviation; // The standard deviation of the Airy disk filter
uniform sampler2D textureMap; // The input texture
uniform vec2 direction; // The direction of the blur

out vec4 outputColor;

const float guassianConstant = 1.0 / sqrt(2.0 * PI);

float gaussianPdf(in float x, in float stdDev) {
    return guassianConstant * exp( -0.5 * pow2( x / stdDev ))/ stdDev;
}

float airyDiskPdf(in float x, in float stdDev) {
   return gaussianPdf(x, stdDev * 0.9)*0.002/0.021;
}

#define KERNEL_RADIUS (7)

void main() {
  vec2 texSize = vec2(textureSize(textureMap, 0));
  
  vec2 vUv = v_uv0;
  vec2 invSize = 1.0 / texSize;
  float weightSum = airyDiskPdf( 0.0, standardDeviation );
  vec3 sourceColor =  texture( textureMap, vUv).rgb;
  vec3 colorSum = sourceColor * weightSum;
  for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
      float x = float( i );
      float weight = airyDiskPdf( x+0.00001, standardDeviation );
      vec2 uvOffset = direction * invSize * x;
      colorSum += ( texture( textureMap, vUv + uvOffset).rgb + texture( textureMap, vUv - uvOffset).rgb ) * weight;
      weightSum += 2.0 * weight;
  }

  vec4 color = vec4( colorSum / weightSum, 1.0 );
  outputColor.rgb = color.rgb; 
  outputColor.a = 1.0;
}