#pragma once

mat3 mat3Identity() {
  return mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
}

// validated against Three.js
mat3 mat3RotateXDirection(const vec2 dir) {
  return mat3(
    vec3(1.0, 0.0, 0.0),
    vec3(0.0, dir.x, -dir.y),
    vec3(0.0, dir.y, dir.x)
  );
}

// validated against Three.js
mat3 mat3RotateYDirection(const vec2 dir) {
  return mat3(
    vec3(dir.x, 0.0, dir.y),
    vec3(0.0, 1.0, 0.0),
    vec3(-dir.y, 0.0, dir.x)
  );
}

// validated against Three.js
mat3 mat3RotateZDirection(const vec2 dir) {
  return mat3(
    vec3(dir.x, -dir.y, 0.0),
    vec3(dir.y, dir.x, 0.0),
    vec3(0.0, 0.0, 1.0)
  );
}

mat3 mat3RotateX(const float angle) {
  return mat3RotateXDirection(vec2(cos(angle), sin(angle)));
}

mat3 mat3RotateY(const float angle) {
  return mat3RotateYDirection(vec2(cos(angle), sin(angle)));
}

mat3 mat3RotateZ(const float angle) {
  return mat3RotateZDirection(vec2(cos(angle), sin(angle)));
}

// https://thebookofshaders.com/08/
mat3 mat3Scale(const vec3 scale) {
  return mat3(
    vec3(scale.x, 0.0, 0.0),
    vec3(0.0, scale.y, 0.0),
    vec3(0.0, 0.0, scale.z)
  );
}
