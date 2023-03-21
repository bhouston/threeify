#pragma once

mat4 mat4Identity() {
  return mat4(
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );
}

mat4 mat4Transpose(const mat4 m) {
  vec4 i0 = m[0];
  vec4 i1 = m[1];
  vec4 i2 = m[2];
  vec4 i3 = m[3];

  return mat4(
    vec4(i0.x, i1.x, i2.x, i3.x),
    vec4(i0.y, i1.y, i2.y, i3.y),
    vec4(i0.z, i1.z, i2.z, i3.z),
    vec4(i0.w, i1.w, i2.w, i3.w)
  );
}

mat4 mat4RotateXDirection(const vec2 dir) {
  return mat4(
    vec4(1.0, 0.0, 0.0, 0.0),
    vec4(0.0, dir.x, -dir.y, 0.0),
    vec4(0.0, dir.y, dir.x, 0.0),
    vec4(0.0, 0.0, 0.0, 1.0)
  );
}

mat4 mat4RotateYDirection(const vec2 dir) {
  return mat4(
    vec4(dir.x, 0.0, dir.y, 0.0),
    vec4(0.0, 1.0, 0.0, 0.0),
    vec4(-dir.y, 0.0, dir.x, 0.0),
    vec4(0.0, 0.0, 0.0, 1.0)
  );
}

mat4 mat4RotateZDirection(const vec2 dir) {
  return mat4(
    vec4(dir.x, -dir.y, 0.0, 0.0),
    vec4(dir.y, dir.x, 0.0, 0.0),
    vec4(0.0, 0.0, 1.0, 0.0),
    vec4(0.0, 0.0, 0.0, 1.0)
  );
}

mat4 mat4RotateX(const float angle) {
  return mat4RotateXDirection(vec2(cos(angle), sin(angle)));
}

mat4 mat4RotateY(const float angle) {
  return mat4RotateYDirection(vec2(cos(angle), sin(angle)));
}

mat4 mat4RotateZ(const float angle) {
  return mat4RotateZDirection(vec2(cos(angle), sin(angle)));
}

// https://thebookofshaders.com/08/
mat4 scale3ToMat4(const vec3 scale) {
  return mat4(
    vec4(scale.x, 0.0, 0.0, 0.0),
    vec4(0.0, scale.y, 0.0, 0.0),
    vec4(0.0, 0.0, scale.z, 0.0),
    vec4(0.0, 0.0, 0.0, 1.0)
  );
}

vec3 mat4TransformPosition(const mat4 m, const vec3 p) {
  return (m * vec4(p, 1.0)).xyz;
}

vec3 mat4TransformDirection(const mat4 m, const vec3 dir) {
  return normalize((m * vec4(dir, 0.0)).xyz);
}

vec3 mat4UntransformDirection(const mat4 m, const vec3 dir) {
  // dir can be either a direction vector or a normal vector
  // upper-left 3x3 of matrix is assumed to be orthogonal
  return normalize((vec4(dir, 0.0) * m).xyz);
}

vec3 mat4ToScale3(const mat4 matrix) {
  return vec3(
    length(matrix[0].xyz),
    length(matrix[1].xyz),
    length(matrix[2].xyz)
  );
}
