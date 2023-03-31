#pragma once

// Plane constructor
struct Plane {
  vec3 pointOnPlane;
  vec3 planeNormal;
};



// Project point onto plane
vec3 projectPointOnPlane(vec3 point, Plane plane) {
  return point - dot(point - plane.pointOnPlane, plane.planeNormal) * plane.planeNormal;
}

float sideOfPlane(vec3 point, Plane plane) {
  return sign(dot(point - plane.pointOnPlane, plane.planeNormal));
}

