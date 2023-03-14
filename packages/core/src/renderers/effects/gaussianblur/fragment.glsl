precision highp float;

#pragma import "../../../shaders/color/tonemapping/acesfilmic.glsl"
#pragma import "../../../shaders/color/spaces/srgb.glsl"
#pragma import "../../../shaders/math/sampling/gaussian.glsl"
#pragma import "../../../shaders/debug/nanDetector.glsl"

in vec2 v_uv0;

uniform int sourceLod;
uniform float standardDeviationInTexels; // The standard deviation of the Gaussian filter
uniform sampler2D sourceMap; // The input texture
uniform vec2 blurDirection; // The direction of the blur
uniform int kernelRadiusInTexels; // The radius of the blur
uniform float targetAlpha; // The target alpha value

out vec4 outputColor;

void main() {
  vec2 sourceTextureSize = vec2(textureSize(sourceMap, sourceLod));
  vec2 texelToUVSpace = 1.0 / sourceTextureSize;

  float weightSum = gaussianPdf(0.0, standardDeviationInTexels);
  vec4 colorSum = texture(sourceMap, v_uv0) * weightSum;

  float sourceLodF = float(sourceLod);

  for (int i = 1; i <= kernelRadiusInTexels; i++) {
    float x = float(i);
    float weight = gaussianPdf(x, standardDeviationInTexels);
    vec2 uvOffset = blurDirection * texelToUVSpace * x;
    colorSum +=
      (textureLod(sourceMap, v_uv0 + uvOffset, sourceLodF) +
        textureLod(sourceMap, v_uv0 - uvOffset, sourceLodF)) *
      weight;
    weightSum += 2.0 * weight;
  }

  outputColor = colorSum / weightSum;
  outputColor *= targetAlpha;

  //nanDetector(outputColor, outputColor);

}
