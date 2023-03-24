#pragma once

#pragma import "./raytracing.glsl"
#pragma import "./refraction.glsl"
#pragma import "./sphere.glsl"
#pragma import "../microgeometry/normalPacking.glsl"
#pragma import "../math/mat4.glsl"
#pragma import "../brdfs/specular/fresnel.glsl"

// https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_volume/README.md
vec3 attentuationCoefficient(
  vec3 attenutationColor,
  float attenuationDistance
) {
  return -log(attenutationColor) / attenuationDistance;
}

vec3 attentuationOverDistance(vec3 attentuationCoefficient, float distance) {
  return exp(-attentuationCoefficient * distance);
}

// Fresnel reflectance function
float fresnelReflectance(vec3 incident, vec3 normal, float ior) {
  float cosIncident = clamp(dot(-incident, normal), 0.0, 1.0);
  float etaI = 1.0;
  float etaT = ior;

  if (cosIncident > 0.0) {
    float temp = etaI;
    etaI = etaT;
    etaT = temp;
  }

  float sinT2 = etaI * etaI * (1.0 - cosIncident * cosIncident) / (etaT * etaT);
  if (sinT2 > 1.0) {
    return 1.0;
  }

  float cosT = sqrt(1.0 - sinT2);

  float rOrth =
    (etaI * cosIncident - etaT * cosT) / (etaI * cosIncident + etaT * cosT);
  float rPar =
    (etaI * cosT - etaT * cosIncident) / (etaI * cosT + etaT * cosIncident);

  float r = 0.5 * (rOrth * rOrth + rPar * rPar);
  return r;
}

#define MANUAL_ATTENUATION (1.0)
#define MAX_RAY_BOUNCES (10)

vec3 rayTraceTransmission(
  Ray localIncidentRay,
  Hit localSurfaceHit,
  Sphere gemLocalSphere,
  float gemIOR,
  mat4 localToWorld,
  vec3 attenuationCoefficient,
  samplerCube gemLocalNormalMap,
  samplerCube iblWorldMap
) {
  vec3 accumulatedColor = vec3(0.0);
  vec3 transmission = vec3(1.0);

  Ray currentRay = localIncidentRay;
  Hit currentHit = localSurfaceHit;

  for (int bounce = 0; bounce < MAX_RAY_BOUNCES; ++bounce) {
    vec3 localNormal =
      texture(gemLocalNormalMap, currentHit.normal).xyz * 2.0 - 1.0;

    float reflectionCoefficient = fresnelReflectance(
      currentRay.direction,
      localNormal,
      gemIOR
    );
    float transmissionCoefficient = 1.0 - reflectionCoefficient;

    // Update accumulated transmission
    transmission *= transmissionCoefficient;

    // Refract the ray
    vec3 refractedRayDirection = refract(
      currentRay.direction,
      localNormal,
      1.0 / gemIOR
    );

    // Calculate new ray origin on the sphere boundary
    vec3 newRayOrigin =
      currentHit.position +
      refractedRayDirection * (gemLocalSphere.radius * 2.0);

    // Construct the refracted ray
    Ray refractedRay = Ray(newRayOrigin, refractedRayDirection);

    // Check for total internal reflection
    if (transmissionCoefficient > 0.0) {
      // Convert refracted ray direction to world space and query IBL
      vec3 worldRefractedDirection = (localToWorld *
        vec4(refractedRay.direction, 0.0)).xyz;
      vec3 iblColor = textureLod(iblWorldMap, worldRefractedDirection, 0.0).rgb;

      // Accumulate color
      accumulatedColor += transmission * iblColor;
    }

    // Calculate the reflected ray direction
    vec3 reflectedRayDirection = reflect(currentRay.direction, localNormal);

    // Construct the reflected ray
    Ray reflectedRay = Ray(currentHit.position, reflectedRayDirection);

    // Update the current ray for the next iteration
    currentRay = reflectedRay;

    // Perform intersection with the sphere for the reflected ray
    // Assuming a sphere intersection function is available: intersectSphere(Ray ray, Sphere sphere, out Hit hit)
    if (!sphereRayIntersection(currentRay, gemLocalSphere, currentHit)) {
      break; // Exit if the ray doesn't intersect the sphere
    }

    // Apply absorption and update accumulated transmission
    float distance = length(currentHit.position - currentRay.origin);
    transmission *= exp(-distance * attenuationCoefficient);
  }

  return accumulatedColor;
}

/*

vec3 rayTraceGem( Ray incidentRay, vec3 surfaceNormal, Sphere gemSphere, samplerCube gemNormalCubeMap, float gemIOR, samplerCube iblCubeMap ) {
    Hit sphereHit;
    sphereRayIntersection( incidentRay,  gemSphere, sphereHit);
    vec3 gemNormal = colorToNormal( texture( gemNormalCubeMap, sphereHit.position, 0.0 ).rgb );
    vec3 gemReflection = reflect( incidentRay.direction, gemNormal );
    vec3 gemRefraction = refract( incidentRay.direction, gemNormal, 1.0 / gemIOR );

    vec3 gemReflectColor = texture( iblCubeMap, gemReflection, 0.0 ).rgb;
    vec3 gemRefractionColor = texture( iblCubeMap, gemRefraction, 0.0 ).rgb;

    // calculate fresnel reflection and transmission
    float fresnel = fresnelReflection( incidentRay.direction, gemNormal, 1.0 / gemIOR );
    gemReflectColor *= fresnel;
    gemRefractionColor *= ( 1.0 - fresnel );


    return gemReflectColor + gemRefractionColor;
}*/

