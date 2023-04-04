#pragma once
#pragma import "../math.glsl"
#pragma import "./ray.glsl"
#pragma import "../math/sphere.glsl"

bool raySphereIntersection(Ray ray, Sphere sphere, out Hit hit) {
  vec3 oc = ray.origin - sphere.origin; // origin to center vector
  float a = dot(ray.direction, ray.direction);
  float b = 2.0 * dot(ray.direction, oc);
  float c = dot(oc, oc) - pow2(sphere.radius);
  float discriminant = b * b - 4.0 * a * c;

  if (discriminant <= 0.0) {
    // no intersection
    return false;
  }

  float sqrtDiscriminant = sqrt(discriminant);
  float t1 = (-b - sqrtDiscriminant) / (2.0 * a);
  float t2 = (-b + sqrtDiscriminant) / (2.0 * a);

  // if there are two intersections, we want the one that is further away
  float t = t1 > t2 ? t1 : t2;

  hit.distance = t;
  hit.position = ray.origin + t * ray.direction;
  hit.normal = normalize(hit.position - sphere.origin);

  return true;
}
