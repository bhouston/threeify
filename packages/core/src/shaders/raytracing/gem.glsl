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

float fresnelReflection(vec3 incidentRay, vec3 surfaceNormal, float eta) {
  float cosTheta = dot(incidentRay, surfaceNormal);
  float sinTheta = sqrt(1.0 - cosTheta * cosTheta);
  float sinThetaPrime = eta * sinTheta;
  float cosThetaPrime = sqrt(1.0 - sinThetaPrime * sinThetaPrime);
  float rParallel =
    (cosTheta - eta * cosThetaPrime) / (cosTheta + eta * cosThetaPrime);
  float rPerpendicular =
    (eta * cosTheta - cosThetaPrime) / (eta * cosTheta + cosThetaPrime);
  return (rParallel * rParallel + rPerpendicular * rPerpendicular) / 2.0;
}

#define MANUAL_ATTENUATION (1.0)
#define MAX_RAY_BOUNCES (6)

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
  // given ior calculate F0
  vec3 F0 = vec3(iorToF0(ior));
  vec3 F90 = vec3(1.0);

  // external reflection
  vec3 externalGemReflection = reflect(
    localIncidentRay.direction,
    localSurfaceHit.normal
  );

  // internal refraction
  vec3 internalGemRefraction = refract(
    localIncidentRay.direction,
    localSurfaceHit.normal,
    1.0 / gemIOR
  );
  Ray internalRay = Ray(
    localSurfaceHit.position + internalGemRefraction * 0.05,
    internalGemRefraction
  );

  //vec3 halfVector = normalize( localSurfaceHit.normal + -localIncidentRay.direction );
  //float VdotH = dot( -localIncidentRay.direction, localSurfaceHit.normal );

 //   vec3 externalFresnel = F_Schlick_2(F0, F90, VdotH); // This works!  Not black at ior 1 at edges.

  // calculate fresnel reflection and transmission
  vec3 externalFresnel = vec3( fresnelReflection( // This works!  Black at ior 1 at edges.
    -localIncidentRay.direction,
    localSurfaceHit.normal,
    1.0 / gemIOR
  ) );
  vec3 externalReflectionCoefficient = saturate(externalFresnel);
  vec3 externalTransmissionCoefficient = saturate(1.0 - externalFresnel);

  vec3 externalWorldReflection = mat4TransformDirection(
    localToWorld,
    externalGemReflection
  );
  vec3 externalColor = texture(iblWorldMap, externalWorldReflection, 0.0).rgb; // TODO: add a mip level here to add some roughness.

  vec3 accumulatedRadiance = vec3( 0.0 );
  vec3 accumulatedAttenuation = vec3( 1.0 );
  
  // external light bouncing of of the diamond.
  accumulatedRadiance += externalColor * externalReflectionCoefficient; // this appears to be correct.
  // NOTE: there is no diminishing of outgoing light by the forward transmission, so do not decay attenuation here,
  // instead it is diminished by its transmission from inside to outside.

  for (int bounce = 0; bounce < MAX_RAY_BOUNCES; bounce++) {
    Hit internalSphereHit;
    if (
      !sphereRayIntersection(internalRay, gemLocalSphere, internalSphereHit)
    ) {
      /*externalWorldReflection = mat4TransformDirection(
        localToWorld,
        internalRay.direction
      );
      externalColor = texture(iblWorldMap, externalWorldReflection, 0.0).rgb;
      accumulatedRadiance +=
        accumulatedAttenuation * attenuationCoefficient * externalColor;*/
      return accumulatedRadiance;
    }

    accumulatedAttenuation *= attentuationOverDistance(
      attenuationCoefficient,
      internalSphereHit.distance
    );

    // map sphere normal to gem normal
    internalSphereHit.normal = colorToNormal(
      texture(gemLocalNormalMap, internalSphereHit.normal, 0.0).rgb
    );

    // internal reflection
    vec3 internalGemReflection = reflect(
      internalRay.direction,
      internalSphereHit.normal
    );

    // interal->external refraction
    vec3 externalLocalRefraction = refract(
      internalRay.direction,
      internalSphereHit.normal,
      gemIOR / 1.0
    ); // Is this the right ETA?
    vec3 externalWorldRefraction = mat4TransformDirection(
      localToWorld,
      externalLocalRefraction
    );

    // calculate fresnel reflection and transmission
    float internalFresnel = fresnelReflection(
      internalRay.direction,
      internalSphereHit.normal,
      gemIOR / 1.0
    ); // Is this the right ETA?
    float internalReflectionCoefficient = saturate(internalFresnel);
    float internalTransmissionCoefficient = saturate(1.0 - internalFresnel);

    externalColor = texture(iblWorldMap, externalWorldRefraction, 0.0).rgb;
    accumulatedAttenuation *= MANUAL_ATTENUATION; // internalReflectionCoefficient;
    accumulatedRadiance +=
      accumulatedAttenuation * internalTransmissionCoefficient * externalColor;

    // update internal ray for next boundce
    internalRay = Ray(
      internalSphereHit.position + internalGemReflection * 0.05,
      internalGemReflection
    );
  }

  return accumulatedRadiance;
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

