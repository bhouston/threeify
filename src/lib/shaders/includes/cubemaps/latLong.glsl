#pragma once

#include <math/math>
#include <math/spherical>

/**
 * local direction -> equirectangular uvs
 */
vec2 directionToLatLongUV( in vec3 dir ) {
  vec2 s = cartesianToNZSpherical( dir );
	return vec2(
		fract( s.x * RECIPROCAL_PI2 + 0.75 ), // this makes maps -z dir to the center of the UV space.
		s.y / PI) ;
}

/**
 * equirectangular uvs -> local direction
 */
vec3 latLongUvToDirection( in vec2 latLongUv ) {
  vec2 s = vec2(
    ( latLongUv.x - 0.75 ) * PI2,
    latLongUv.y * PI );
  return nzSphericalToCartesian( s );
}
