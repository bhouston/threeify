precision highp float;

#pragma import "@threeify/core/dist/shaders/color/tonemapping/acesfilmic.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"

in vec2 v_uv0;

uniform float filterWidthInPixels; // The standard deviation of the Airy disk filter
uniform sampler2D textureMap; // The input texture
uniform vec2 direction; // The direction of the blur

out vec4 outputColor;

#define NUM_SAMPLES (13) // Target sampling rate
#define KERNAL_RADIUS (NUM_SAMPLES / 2 - 1) // Kernel radius


// Function to perform 1D convolution

void main() {
  ivec2 size = textureSize(textureMap, 0);
vec2 textureMapSize = vec2(float(size.x), float(size.y));

vec2 filterWidthInTextureCoords = vec2(filterWidthInPixels) / textureMapSize;
// Calculate LOD level based on filter width and target sampling rate
float lodLevel =
  max(
    0.0,
    log2(
      ( ( filterWidthInPixels) / float(NUM_SAMPLES) )
    )
);

  // based on https://www.shadertoy.com/view/WtKfD3
  float weightSum = 1.; // exp( -2.0 * 0 * 0 ) = 1
  vec4 colorSum = texture(textureMap, v_uv0, lodLevel);
  for (int i = 1; i <= KERNAL_RADIUS; i++) {
    float kernelX = float( i ) / float( KERNAL_RADIUS );
    float weight = exp(-2.0 * pow2( kernelX * 2.0 ) );
    vec2 uvOffset = filterWidthInTextureCoords * direction * kernelX * 0.5;
    colorSum +=
      weight *
      (textureLod(textureMap, v_uv0 + uvOffset, lodLevel) +
        textureLod(textureMap, v_uv0 - uvOffset, lodLevel));
    weightSum += 2. * weight;
  }

  outputColor = colorSum / weightSum;

}
