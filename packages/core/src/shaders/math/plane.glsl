#pragma once


struct Plane {
  vec3 normal;
  float constant;
};


float planeDistanceToPoint( Plane plane, vec3 point ) {
  return dot(point, plane.normal) + plane.constant;
}

// Project point onto plane
vec3 planeProjectPoint(vec3 point, Plane plane) {
  return point - plane.normal * dot(point, plane.normal);
}

float planeSignOfPoint(Plane plane, vec3 point ) {
  return sign( planeDistanceToPoint( plane, point ) );
}
