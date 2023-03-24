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
  
  return clamp( (rParallel * rParallel + rPerpendicular * rPerpendicular) / 2.0, 0.0, 1.0 );
}

vec3 localDirectionToIBLSample(
  vec3 localDirection,
  mat4 localToWorld,
  samplerCube iblWorldMap
) {
  vec3 worldDirection = mat4TransformDirection(localToWorld, localDirection);
  return texture(iblWorldMap, worldDirection, 0.0).rgb;
}

#define MANUAL_ATTENUATION (1.0)
#define MAX_RAY_BOUNCES (30)

vec3 rayTraceTransmission(
  Ray localIncidentRay,
  Hit localSurfaceHit,
  Sphere gemLocalSphere,
  float gemIOR,
  mat4 localToWorld,
  vec3 attenuationCoefficient,
  samplerCube gemLocalNormalMap,
  samplerCube iblWorldMap,
  int maxBounces
) {
  // external reflection
  vec3 externalLocalReflection = reflect(
    localIncidentRay.direction,
    localSurfaceHit.normal
  );
  // internal reflection
  vec3 internalLocalRefraction = refract(
    localIncidentRay.direction,
    localSurfaceHit.normal,
    1.0 / gemIOR
  );
  Ray internalRay = Ray(localSurfaceHit.position, internalLocalRefraction);

  // calculate fresnel reflection and transmission
  float reflection = 
    fresnelReflection( // This works!  Black at ior 1 at edges.
      -localIncidentRay.direction,
      localSurfaceHit.normal,
      1.0 / gemIOR
    );

  vec3 externalColor = localDirectionToIBLSample( externalLocalReflection, localToWorld, iblWorldMap );

  vec3 accumulatedRadiance = vec3(0.0);
  vec3 accumulatedAttenuation = vec3(1.0);

  accumulatedRadiance += externalColor * reflection;

  // NOTE: there is no diminishing of outgoing light by the forward transmission, so do not decay attenuation here,
  // instead it is diminished by its transmission from inside to outside.
  // accumulatedAttenuation *= fresnel.transmission;

  for (int bounce = 0; bounce < MAX_RAY_BOUNCES; bounce++) {
    if (maxBounces != -1 && bounce >= maxBounces) {
      break;
    }
    Hit internalSphereHit;
    if (
      !sphereRayIntersection(internalRay, gemLocalSphere, internalSphereHit)
    ) {
      //accumulatedRadiance += vec3( 1., 0., 0. ); // * accumulatedAttenuation;
      break;
    }

    accumulatedAttenuation *= attentuationOverDistance(
      attenuationCoefficient,
      internalSphereHit.distance
    );

    // map sphere normal to gem normal - appers to be correct.
    internalSphereHit.normal = colorToNormal(
      texture(gemLocalNormalMap, internalSphereHit.normal, 0.0).rgb
    );

    // calculate fresnel reflection and transmission
    reflection = fresnelReflection(
      -internalRay.direction, // validated
      -internalSphereHit.normal, // validated
      gemIOR / 1.0 // validated
    );

    // internal reflection
    vec3 internalGemReflection = reflect(
      internalRay.direction, // validated
      -internalSphereHit.normal // validated
    );

    vec3 externalLocalRefraction = internalRay.direction;
    if( reflection >= 0.0 && reflection <= 0.99 ) {
      // interal->external reflection
      externalLocalRefraction = refract(
        internalRay.direction, // validated
        -internalSphereHit.normal, // validated
        gemIOR / 1.0 // validated
      );

      accumulatedRadiance += accumulatedAttenuation * ( 1.0 - reflection ) * localDirectionToIBLSample( externalLocalRefraction, localToWorld, iblWorldMap );
    }
    else {
      //reflection = 1.0;
     if( bounce == ( MAX_RAY_BOUNCES - 1 ) || bounce == ( maxBounces - 1 ) ) {
    //    accumulatedRadiance += accumulatedAttenuation * localDirectionToIBLSample( internalRay.direction, localToWorld, iblWorldMap );
      }
      else {
      //     accumulatedRadiance += accumulatedAttenuation * localDirectionToIBLSample( internalRay.direction, localToWorld, iblWorldMap );
      }
    }
    // if( reflection == 1.0 ) { 
    //  accumulatedRadiance += vec3( 0., 0., 1. ) * 0.25;
    //}
    if( reflection == 0.0 ) { // this is happening a lot.
      accumulatedRadiance += vec3( 1., 0., 0. ) * 0.25;
    }
    if( isnan( reflection ) ) {
      return vec3( 1., 0., 1. );
    }
    // check for inf
    if( reflection == 1.0 / 0.0 ) {
      return vec3( 0., 1., 1. );
    }
    accumulatedAttenuation *= reflection;

    // update internal ray for next boundce
    internalRay = Ray(internalSphereHit.position, internalGemReflection);
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

