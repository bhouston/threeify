#pragma once
#pragma include <math>

vec3 rgbeToLinear(vec4 value) {
  return vec3(value.rgb * exp2(value.a * 255.0 - 128.0));
}

vec4 linearToRGBE(vec3 value) {
  float maxComponent = max(max(value.r, value.g), value.b);
  float fExp = clamp(ceil(log2(maxComponent)), -128.0, 127.0);
  return vec4(value.rgb / exp2(fExp), (fExp + 128.0) / 255.0);
}
