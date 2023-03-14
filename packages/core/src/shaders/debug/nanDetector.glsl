#pragma once

bool nanDetector(vec4 sourceColor, out vec4 result) {
  if (isnan(sourceColor.r) || isnan(sourceColor.g) || isnan(sourceColor.b)) {
    result = vec4(1.0, 0.0, 0.0, 1.0);
    return true;
  }
  if (isinf(sourceColor.r) || isinf(sourceColor.g) || isinf(sourceColor.b)) {
    result = vec4(1.0, 1.0, 0.0, 1.0);
    return true;
  }
  if (sourceColor.rgb == vec3(0.0)) {
    result = vec4(0.0, 0.0, 1.0, 1.0);
    return true;
  }
  result = sourceColor;
  result.a = 1.0;
  return false;
}
