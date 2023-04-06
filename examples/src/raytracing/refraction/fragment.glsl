precision highp float;

in vec3 v_viewSurfaceNormal;

uniform mat4 viewToWorld;
uniform mat4 worldToView;
uniform mat4 clipToView;

#define MAX_SPHERES (40)

uniform vec3 sphereOrigin;
uniform mat4 sphereToWorld;
uniform mat4 worldToSphere;
uniform float sphereRadius;
uniform vec3 sphereAttenuationColor;
uniform vec3 sphereAttenuationDistance;
uniform float sphereIor;

uniform int debugOutput;
uniform int numBounces;

uniform samplerCube iblWorldMap;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"
#pragma import "@threeify/core/dist/shaders/cubemaps/latLong.glsl"
#pragma import "@threeify/core/dist/shaders/raytracing/sphere.glsl"
#pragma import "@threeify/core/dist/shaders/raytracing/plane.glsl"
#pragma import "@threeify/core/dist/shaders/microgeometry/normalPacking.glsl"
#pragma import "@threeify/core/dist/shaders/color/tonemapping/acesfilmic.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"

// https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_volume/README.md
vec3 attentuationCoefficient(
  vec3 attenutationColor,
  float attenuationDistance
) {
  return -log(attenutationColor) / attenuationDistance;
}

// validated.
vec3 attentuationOverDistance(vec3 attentuationCoefficient, float distance) {
  return exp(-attentuationCoefficient * distance);
}

float fresnelReflection(vec3 incidentRay, vec3 surfaceNormal, float eta) {
  float cosTheta = dot(incidentRay, surfaceNormal);
  float sinTheta = sqrt(1.0 - cosTheta * cosTheta);
  float sinThetaPrime = eta * sinTheta;
  float cosThetaPrime = sqrt(1.0 - sinThetaPrime * sinThetaPrime);
  float rParallel =
    (cosTheta - eta * cosThetaPrime) /
    (cosTheta + eta * cosThetaPrime + 0.000001);
  float rPerpendicular =
    (eta * cosTheta - cosThetaPrime) /
    (eta * cosTheta + cosThetaPrime + 0.000001);

  return clamp(
    (rParallel * rParallel + rPerpendicular * rPerpendicular) / 2.0,
    0.0,
    1.0
  );
}

#define MAX_BOUNCES (12)

void main() {
  vec3 accumulatedColor = vec3(0.0);
  vec3 transmission = vec3(1.0);

  // convert from screen space to ray.
  vec3 viewDirection = normalize(v_viewSurfaceNormal);

  // create ray
  Ray viewRay = Ray(vec3(0.0), viewDirection);
  Ray worldRay = mat4TransformRay(viewToWorld, viewRay);

  Sphere worldSphere = Sphere(sphereOrigin, sphereRadius);
  Hit externalHit;
  if (raySphereIntersection(worldRay, worldSphere, externalHit)) {
    vec3 reflectedRayDirection = reflect(
      worldRay.direction,
      externalHit.normal
    );
    vec3 refractedRayDirection = refract(
      worldRay.direction,
      externalHit.normal,
      1.0 / sphereIor
    );

    vec3 iblColor = texture(iblWorldMap, reflectedRayDirection, 0.0).rgb;
    accumulatedColor += iblColor * 0.3;
   

    iblColor = texture(iblWorldMap, refractedRayDirection, 0.0).rgb;
    accumulatedColor += iblColor * 0.3;
   
  }

  outputColor.rgb = linearTosRGB(tonemappingACESFilmic(accumulatedColor));
  outputColor.a = 1.0;
  return;

}