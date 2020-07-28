#pragma once

// -z is spherical axis
vec3 sphericalToCartesian( vec2 s ) {
  vec2 cs = cos( s );
  vec2 ss = sin( s );
	return vec3( cs.x * ss.y, cs.y, ss.x * ss.y );
}

// -z is spherical axis
vec2 cartesianToSpherical( vec3 dir ) {
	return vec2( atan( dir.z, dir.x ), acos( dir.y ) );
}

