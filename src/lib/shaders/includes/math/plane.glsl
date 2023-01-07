#pragma once

vec3 projectOnPlane(vec3 point, vec3 pointOnPlane, vec3 planeNormal) {
  float distance = dot(planeNormal, point - pointOnPlane);
  return -distance * planeNormal + point;
}

float sideOfPlane(vec3 point, vec3 pointOnPlane, vec3 planeNormal) {
  return sign(dot(point - pointOnPlane, planeNormal));
}

vec3 linePlaneIntersect(
  vec3 pointOnLine,
  vec3 lineDirection,
  vec3 pointOnPlane,
  vec3 planeNormal
) {
  return lineDirection *
    (dot(planeNormal, pointOnPlane - pointOnLine) /
      dot(planeNormal, lineDirection)) +
  pointOnLine;
}
