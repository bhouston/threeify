#pragma once

vec3 flatSurfaceNormal(vec3 position) {
  return normalize(cross(dFdx(position), dFdy(position)));
}
