#pragma once

vec3 transformPosition( in mat4 m, in vec3 p ) {
    return ( m * vec4( p, 1. ) ).xyz;
}

vec3 transformDirection( in mat4 m, in vec3 d ) {
	return normalize( ( m * vec4( d, 0. ) ).xyz );
}

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	// dir can be either a direction vector or a normal vector
	// upper-left 3x3 of matrix is assumed to be orthogonal
	return normalize( ( vec4( dir, 0. ) * matrix ).xyz );
}
