#pragma once
#pragma import "./raytracing.glsl"

struct Ellipse {
  vec3 origin;
  vec3 radii;
};

bool ellipseRayIntersection(Ray ray, Ellipse ellipse, out Hit hit) {
  vec3 rayOriginInEllipseSpace = (ray.origin - ellipse.origin) / ellipse.radii;
  vec3 rayDirectionInEllipseSpace = ray.direction / ellipse.radii;

  float a = dot(rayDirectionInEllipseSpace, rayDirectionInEllipseSpace);
  float b = 2.0 * dot(rayDirectionInEllipseSpace, rayOriginInEllipseSpace);
  float c = dot(rayOriginInEllipseSpace, rayOriginInEllipseSpace) - 1.0;

  float discriminant = b * b - 4.0 * a * c;
  if (discriminant < 0.0) {
    return false;
  }

  float sqrtDiscriminant = sqrt(discriminant);
  float t1 = (-b - sqrtDiscriminant) / (2.0 * a);
  float t2 = (-b + sqrtDiscriminant) / (2.0 * a);

  if (t1 > t2) {
    float temp = t1;
    t1 = t2;
    t2 = temp;
  }

  float t = t1 < 0.0 ? t2 : t1;
  hit.distance = t;
  if (t < 0.0) {
    return false;
  }

  vec3 hitPosition = ray.origin + t * ray.direction;
  vec3 hitPositionInEllipseSpace =
    (hitPosition - ellipse.origin) / ellipse.radii;
  vec3 hitNormal = normalize(hitPositionInEllipseSpace);
  hitNormal = normalize(
    vec3(
      hitNormal.x / ellipse.radii.x,
      hitNormal.y / ellipse.radii.y,
      hitNormal.z / ellipse.radii.z
    )
  );

  hit.position = hitPosition;
  hit.normal = hitNormal;

  return true;
}
