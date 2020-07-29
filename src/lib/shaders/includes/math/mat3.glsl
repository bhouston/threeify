#pragma once

mat3 mat3Identity() {
  return mat3( 1., 0., 0., 0., 1., 0., 0., 0., 1. );
}
// https://thebookofshaders.com/08/
mat3 mat3RotateZDirection( vec2 dir ){
  return mat3(
    vec3( dir.x, -dir.y, 0. ),
    vec3( dir.y,  dir.x, 0. ),
    vec3( 0., 0., 1. ) );
}

// https://thebookofshaders.com/08/
mat3 mat3RotateX( float angle ){
  float c = cos(angle);
  float s = sin(angle);
  return mat3(
    vec3( 1., 0., 0. ),
    vec3( 0.,  c, -s ),
    vec3( 0.,  s,  c ) );
}

// https://thebookofshaders.com/08/
mat3 mat3RotateY( float angle ){
  float c = cos(angle);
  float s = sin(angle);
  return mat3(
    vec3(  c, 0., -s ),
    vec3( 0., 1., 0. ),
    vec3(  s, 0.,  c ) );
}

// https://thebookofshaders.com/08/
mat3 mat3RotateZ( float angle ){
  return mat3RotateZDirection( vec2( cos(angle), sin(angle) ) );
}

// https://thebookofshaders.com/08/
mat3 mat3Scale( vec3 scale ){
  return mat3(
    vec3( scale.x, 0., 0. ),
    vec3( 0., scale.y, 0. ),
    vec3( 0., 0., scale.z ) );
}
