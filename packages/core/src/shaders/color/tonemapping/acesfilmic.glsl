#pragma once
#pragma import "../../math.glsl"

// source: https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/
vec3 tonemappingACESFilmic(vec3 color) {
  return saturate(
    color * (2.51 * color + 0.03) / (color * (2.43 * color + 0.59) + 0.14)
  );
}
