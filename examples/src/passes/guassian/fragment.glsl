precision highp float;


#pragma import "@threeify/core/dist/shaders/color/tonemapping/acesfilmic.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"

in vec2 v_uv0;

uniform float standardDeviation; // The standard deviation of the Gaussian filter
uniform sampler2D textureMap; // The input texture

out vec4 outputColor;

float distanceSquared( int x, int y ) {
  return float(x * x + y * y);
}

#define FILTER_SAMPLES (11)
#define FILTER_RADIUS ((FILTER_SAMPLES - 1)/ 2)

vec4 approximateGaussian(sampler2D tex, vec2 texCoord, float stdDeviation) {
  ivec2 size = textureSize(tex, 0);
  float textureWidth = length( vec2(float(size.x), float(size.y)));
  float lod = log2(textureWidth)-log2(textureWidth / stdDeviation);

  vec4 color = vec4(0.0);
  float totalWeight = 0.0;

  for (int i = -FILTER_RADIUS; i <= FILTER_RADIUS; i++) {
    for (int j = -FILTER_RADIUS; j <= FILTER_RADIUS; j++) {
      vec2 offset = vec2(float(i), float(j)) * 0.75;
      float weight = exp(
        -dot( offset, offset ) / (2.0 * stdDeviation * stdDeviation)
      );
      totalWeight += weight;
      color += textureLod(tex, texCoord + offset / textureWidth, lod) * weight;
    }
  }

  return color / totalWeight;
}

void main() {
  vec4 color = approximateGaussian(
    textureMap,
    v_uv0,
    standardDeviation
  );
  outputColor.rgb = linearTosRGB(tonemappingACESFilmic(color.rgb)); // textureLod(texture, v_homogeneousVertexPosition.xy, 0.0);
  outputColor.a = 1.0;
  //outputColor.r = 1.0;
  //outputColor.a = 1.0;
}
