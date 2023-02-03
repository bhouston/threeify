#pragma once

vec3 adjustNormal(mat3 tangentToView, vec3 localNormal) {
  mat3 tangentToView2 =
    tangentToView *
    mat3(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), normalize(localNormal));
  vec3 adjustedNormal = tangentToView2[2];
  return normalize(adjustedNormal);
}
