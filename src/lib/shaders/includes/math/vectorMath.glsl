vec3 project(const vec3 a, const vec3 normal) {
  return normal * dot(a, normal);
}

vec3 ortho(const vec3 a, const vec3 normal) {
  return a - project(a, normal);
}
