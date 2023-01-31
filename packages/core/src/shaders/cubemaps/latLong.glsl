#pragma once

#pragma include <math/math>
#pragma include <math/spherical>

/**
 * local direction -> equirectangular uvs
 */
vec2 directionToLatLongUV(vec3 dir) {
  vec2 s = cartesianToNZSpherical(dir);
  return vec2(
    fract(s.x * RECIPROCAL_PI2 + 0.75), // this makes maps -z dir to the center of the uv0 space.
    s.y / PI
  );
}

/**
 * equirectangular uvs -> local direction
 */
vec3 latLongUvToDirection(vec2 latLongUv) {
  vec2 s = vec2((latLongUv.x - 0.75) * PI2, latLongUv.y * PI);
  return nzSphericalToCartesian(s);
}
