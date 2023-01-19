vec2 weyl(int i) {
  //return fract(float(n)*vec2(0.754877669, 0.569840296));
  return fract(vec2(i * ivec2(12664745, 9560333)) / exp2(24.0)); // integer mul to avoid round-off
}

float halton(int b, int i) {
  float r = 0.0;
  float f = 1.0;
  for (int j = 0; j < 2048; j++) {
    if (i <= 0) break;
    f = f / float(b);
    r = r + f * mod(float(i), float(b));
    i = int(floor(float(i) / float(b)));
  }
  return r;
}

float halton2(int i) {
  //#if __VERSION__ >= 400
  //	return float(bitfieldReverse(uint(i)))/4294967296.0;
  //#else
  return halton(2, i);
  //#endif
}

vec2 halton23(int i) {
  return vec2(halton2(i), halton(3, i));
}

vec2 hammersley2(int i, int n) {
  return vec2(halton2(i), float(i) / float(n));
}

// modified from source: https://www.shadertoy.com/view/XlKSDz
/*
float hammersley( const in uint sampleIndex )
{
    uint bits = (sampleIndex << 16u) | (sampleIndex >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return float(bits) * 2.3283064365386963e-10;
}

vec2 hammersley2( const in uint sampleIndex, const in uint numSamples ) {
  float u = float(sampleIndex) / float(numSamples);
	float v = hammersley(sampleIndex);

  return vec2( u, v );
}
*/

/*
float Hammersley(uint i)
{
    return bitfieldReverse(i) * 2.3283064365386963e-10;
}
*/

