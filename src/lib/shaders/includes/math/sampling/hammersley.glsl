// modified from source: https://www.shadertoy.com/view/XlKSDz
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

/*
float Hammersley(uint i)
{
    return bitfieldReverse(i) * 2.3283064365386963e-10;
}
*/
