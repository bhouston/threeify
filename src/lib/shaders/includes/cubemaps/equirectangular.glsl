#pragma once

#include <math/math>

vec2 directionToEquirectangularUV( in vec3 dir ) {
	return vec2(
		0.5 + 0.5 * atan(dir.z, dir.x) / PI,
		1. - acos(dir.y) / PI);
}

vec3 equirectangularUvToDirection( in vec2 uv ) {
  vec2 spherical = uv * vec2( PI, PI * 0.5 );
  float cos_y = cos(spherical.y);
  float sin_y = sin(spherical.y);
  float cos_x = cos(spherical.x);
  float sin_x = sin(spherical.x);
	return vec3( cos_y * sin_x, sin_y, cos_y * cos_x );
}
