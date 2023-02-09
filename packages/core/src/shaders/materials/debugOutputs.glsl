#pragma once

vec4 toVec4(int value, int maximum) {
  return vec4(vec3(float(value) / float(maximum)), 1.);
}
vec4 toVec4(float value) {
  return vec4(vec3(value), 1.);
}
vec4 toVec4(vec2 value) {
  return vec4(value.x, value.y, 0., 1.);
}
vec4 toVec4(vec3 value) {
  return vec4(value, 1.);
}

#if defined(DEBUG_OUTPUTS)
#define DEBUG_OUTPUT(index, output)                                            \
  if (debugOutputIndex == (index)) {                                           \
    outputColor = toVec4(output);                                              \
    return;                                                                    \
  }
#else
#define DEBUG_OUTPUT(index, output)
#endif

