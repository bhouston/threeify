#pragma once

#pragma import "./raytracing.glsl"
#pragma import "../math/plane.glsl"

// Ray - Plane intersection
bool rayPlaneIntersection(Ray ray, Plane plane, out Hit hit) {
  float denominator = dot(ray.direction, plane.planeNormal);
  if (denominator == 0.0) {
    return false;
  }
  float t =
    dot(plane.pointOnPlane - ray.origin, plane.planeNormal) / denominator;
  hit.position = ray.origin + t * ray.direction;
  hit.normal = plane.planeNormal;
  hit.distance = t;
  return true;
}
