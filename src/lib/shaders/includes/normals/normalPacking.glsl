#pragma once

vec3 normalToRgb(const vec3 normal) {
  return normalize(normal) * 0.5 + 0.5;
}

vec3 rgbToNormal(const vec3 rgb) {
  return 2.0 * rgb.xyz - 1.0;
}
