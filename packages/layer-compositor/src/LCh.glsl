// According to https://www.w3.org/TR/compositing-1/#blendingnonseparable
const vec3 lumaCoef = vec3(0.3, 0.59, 0.11);

float minComponent(vec3 color) {
  return min(color.r, min(color.g, color.b));
}

float maxComponent(vec3 color) {
  return max(color.r, max(color.g, color.b));
}

float getLuma(vec3 color) {
  return dot(color, lumaCoef);
}

float getChroma(vec3 color) {
  return maxComponent(color) - minComponent(color);
}

// Sets the Chroma, whilst keeping the Hue, and discarding the Luma
vec3 withChroma(vec3 color, float chroma) {
  float min = minComponent(color);
  float max = maxComponent(color);

  if (min >= max) {
    // Gray Color
    return vec3(0.0);
  }

  float curChroma = getChroma(color);

  vec3 withSat = (color - min) * chroma / curChroma;
  return withSat;
}

vec3 withLuma(vec3 color, float luma) {
  float curLuma = getLuma(color);
  float dLuma = luma - curLuma;

  // This works because lumaCoef sums to 1.
  vec3 withL = color + dLuma;

  float min = minComponent(withL);
  float max = maxComponent(withL);

  // In case the color ends up outside the RGB Gamut, re-scale the color to amke it fit.
  if (min < 0.0) {
    return (withL - luma) * luma / (luma - min) + luma;
  } else if (max > 1.0) {
    return (withL - luma) * (1.0 - luma) / (max - luma) + luma;
  } else {
    return withL;
  }

}

vec3 mixLCH(vec3 lumaColor, vec3 chromaColor, vec3 hueColor) {
  float targetChroma = getChroma(chromaColor);
  float targetLuma = getLuma(lumaColor);

  return withLuma(withChroma(hueColor, targetChroma), targetLuma);

}

vec3 mixLCHFast(vec3 lumaColor, vec3 chromaHueColor) {
  float targetLuma = getLuma(lumaColor);
  return withLuma(chromaHueColor, targetLuma);

}
