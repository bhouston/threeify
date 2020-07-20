#pragma once

#include <math/math>

/**
 * local direction -> equirectangular uvs
 */
vec2 directionToEquirectangularUV( in vec3 dir ) {
	return vec2(
		fract( atan(dir.z, dir.x) * RECIPROCAL_PI2 + 0.75 ), // this makes maps -z dir to the center of the UV space.
		acos(dir.y) / PI);
}

/**
 * equirectangular uvs -> local direction
 */
vec3 equirectangularUvToDirection( in vec2 uv ) {
  vec2 s = vec2(
    ( uv.x - 0.75 ) * PI2,
    uv.y * PI );
  vec2 cs = cos( s );
  vec2 ss = sin( s );
	return vec3( cs.x * ss.y, cs.y, ss.x * ss.y );
}
