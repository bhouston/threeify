#pragma once

#pragma import "../math/mat4.glsl"

struct Ray {
  vec3 origin;
  vec3 direction;
};

struct Hit {
  float distance;
  vec3 position;
  vec3 normal;
};

Ray mat4TransformRay(const mat4 m, const Ray r) {
  return Ray(
    mat4TransformPosition3(m, r.origin),
    mat4TransformNormal3(m, r.direction)
  );
}

Hit mat4TransformHit(const mat4 m, const Hit h) {
  return Hit(
    h.distance * determinant(m),
    mat4TransformPosition3(m, h.position),
    mat4TransformNormal3(m, h.normal)
  );
}
