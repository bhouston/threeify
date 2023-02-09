#pragma once
#pragma include <math/math>

// source: https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/
vec3 tonemappingACESFilmic(vec3 color) {
  return saturate(
    color * (2.51 * color + 0.03) / (color * (2.43 * color + 0.59) + 0.14)
  );
}

vec3 untonemapACESFilmic(vec3 tonemapped) {
  return (0.5 * (sqrt(-10127. * ( tonemapped * tonemapped ) + 13702.* tonemapped + 9.) - 59.* tonemapped + 3.))/(243.* tonemapped - 251.);
}