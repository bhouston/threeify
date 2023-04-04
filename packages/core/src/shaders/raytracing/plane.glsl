#pragma once
#pragma import "./ray.glsl"
#pragma import "../math/plane.glsl"

// Ray - Plane intersection
bool rayPlaneIntersection(Ray ray, Plane plane, out Hit hit) {
  float denominator = dot(ray.direction, plane.normal);
  if (denominator == 0.0) {
    return false;
  }
  float distance = planeDistanceToPoint(plane, ray.origin) / denominator;
  if (distance < 0.0) {
    return false;
  }
  hit.distance = distance;
  hit.position = ray.origin + ray.direction * distance;
  hit.normal = plane.normal;
  return true;
}