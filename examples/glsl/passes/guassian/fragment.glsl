precision highp float;

uniform float standardDeviation; // The standard deviation of the Gaussian filter
uniform sampler2D texture; // The input texture

out vec4 outputColor;

float distanceSquared( int x, int y ) {
  return float(x * x + y * y);
}

#define FILTER_RADIUS (2)

vec4 approximateGaussian(sampler2D tex, vec2 texCoord, float stdDeviation) {
  vec2 size = textureSize(texture, 0);
  float size = length(textureSize);
  float lod = log2(size / stdDeviation);

  vec4 color = vec4(0.0);
  float totalWeight = 0.0;

  for (int i = -FILTER_RADIUS; i <= FILTER_RADIUS; i++) {
    for (int j = -FILTER_RADIUS; j <= FILTER_RADIUS; j++) {
      float weight = exp(
        -distanceSquared( i, j ) / (2.0 * stdDeviation * stdDeviation)
      );
      totalWeight += weight;
      color += textureLod(tex, texCoord + vec2(i, j) / size, lod) * weight;
    }
  }

  return color / totalWeight;
}

void main() {
  vec4 color = approximateGaussian(
    texture,
    gl_FragCoord.xy,
    standardDeviation
  );
  outputColor = color;
}
