#pragma once

mat4 mat4Identity() {
  return mat4(
    1., 0., 0., 0.,
    0., 1., 0., 0.,
    0., 0., 1., 0.,
    0., 0., 0., 1. );
}

mat4 mat4RotateXDirection( vec2 dir ){
  return mat4(
    vec4( 1.,     0.,    0.,  0. ),
    vec4( 0., dir.x, -dir.y,  0. ),
    vec4( 0., dir.y,  dir.x,  0. ),
    vec4( 0.,     0.,    0.,  1. ) );
}

mat4 mat4RotateYDirection( vec2 dir ){
  return mat4(
    vec4( dir.x,  0., dir.y,  0. ),
    vec4(    0.,  1.,     0.,  0. ),
    vec4( -dir.y,  0.,  dir.x,  0. ),
    vec4(    0.,  0.,     0.,  1. ) );
}

mat4 mat4RotateZDirection( vec2 dir ){
  return mat4(
    vec4( dir.x, -dir.y,  0.,  0. ),
    vec4( dir.y,  dir.x,  0.,  0. ),
    vec4(     0.,     0., 1.,  0. ),
    vec4(     0.,     0., 0.,  1. ) );
}

mat4 mat4RotateX( float angle ){
  return mat4RotateXDirection( vec2( cos(angle), sin(angle) ) );
}

mat4 mat4RotateY( float angle ){
  return mat4RotateYDirection( vec2( cos(angle), sin(angle) ) );
}

mat4 mat4RotateZ( float angle ){
  return mat4RotateZDirection( vec2( cos(angle), sin(angle) ) );
}

// https://thebookofshaders.com/08/
mat3 mat3Scale( vec3 scale ){
  return mat3(
    vec3( scale.x, 0., 0. ),
    vec3( 0., scale.y, 0. ),
    vec3( 0., 0., scale.z ) );
}

vec3 mat4TransformPosition( in mat4 m, in vec3 p ) {
    return ( m * vec4( p, 1. ) ).xyz;
}

vec3 mat4TransformDirection( in mat4 m, in vec3 dir ) {
	return normalize( ( m * vec4( dir, 0. ) ).xyz );
}

vec3 mat4UntransformDirection( in mat4 m, in vec3 dir ) {
	// dir can be either a direction vector or a normal vector
	// upper-left 3x3 of matrix is assumed to be orthogonal
	return normalize( ( vec4( dir, 0. ) * m ).xyz );
}
