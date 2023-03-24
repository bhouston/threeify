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

//#define DEBUG_FIRST_BOUNCE

vec3 rayTraceTransmission(
  Ray incidentRay, // local 
  Hit surfaceHit, // local
  Sphere gemSphere, // local
  float gemIOR,
  mat4 localToWorld,
  vec3 attenuationCoefficient,
  samplerCube gemNormalMap, // local
  samplerCube iblWorldMap, // world
  int maxBounces
) {

  vec3 accumulatedColor = vec3(0.0);
  vec3 transmission = vec3(1.0);

  vec3 reflectedRayDirection = reflect(
    incidentRay.direction,
    surfaceHit.normal
  );
  Ray reflectedRay = Ray(surfaceHit.position, reflectedRayDirection);

  vec3 refractedRayDirection = refract(
    incidentRay.direction,
    surfaceHit.normal,
    1.0 / gemIOR
  );
  Ray internalRay = Ray(surfaceHit.position, refractedRayDirection);

  // calculate fresnel reflection and transmission
  float reflectionCoefficient = 
    fresnelReflection( // This works!  Black at ior 1 at edges.
      -incidentRay.direction,
      surfaceHit.normal,
      1.0 / gemIOR
    );

  vec3 iblColor = localDirectionToIBLSample( reflectedRayDirection, localToWorld, iblWorldMap );

  accumulatedColor += reflectionCoefficient * iblColor;
  
  float transmissionCoefficient = 1.0 - reflectionCoefficient;
  transmission *= transmissionCoefficient;

#ifdef DEBUG_FIRST_BOUNCE
  iblColor = localDirectionToIBLSample( refractedRayDirection, localToWorld, iblWorldMap );
  accumulatedColor += transmission * iblColor;
  return accumulatedColor;
#endif DEBUG_FIRST_BOUNCE

  for (int bounce = 0; bounce < maxBounces; bounce++) {
    Hit sphereHit;
    if (
      !sphereRayIntersection(internalRay, gemSphere, sphereHit)
    ) {
      accumulatedColor += vec3( 1., 0., 0. ); // * accumulatedAttenuation;
      break;
    }
    
    vec3 attentuationCoefficient = attentuationOverDistance(
      attenuationCoefficient,
      sphereHit.distance
    ); 
    transmission *= attentuationCoefficient;

    // map sphere normal to gem normal - appers to be correct.
    sphereHit.normal = colorToNormal(
      texture(gemNormalMap, normalize( sphereHit.normal * vec3( 1., 1., 1. ) ), 0.0).rgb
    );

    // Apply absorption and update accumulated transmission
    float distance = length(sphereHit.position - internalRay.origin);
   // transmission *= exp(-distance * attenuationCoefficient);

    // calculate fresnel reflection and transmission
    reflectionCoefficient = fresnelReflection(
      internalRay.direction, // validated
      sphereHit.normal, // validated
      1.0 / gemIOR // validated
    );

    // internal reflection
    reflectedRayDirection = reflect(
      internalRay.direction, // validated
      sphereHit.normal // validated
    );

    // interal->external reflection
    refractedRayDirection = refract(
        internalRay.direction, // validated
        sphereHit.normal, // validated
        1.0 / gemIOR // validated
      );

    transmissionCoefficient = 1.0 - reflectionCoefficient;
   
    if( transmissionCoefficient >= 0.0 ) {
        vec3 iblColor = localDirectionToIBLSample( refractedRayDirection, localToWorld, iblWorldMap );
        accumulatedColor += transmission * transmissionCoefficient * iblColor;
    }
    
    if( reflectionCoefficient == 1.0 ) { 
      accumulatedColor += vec3( 0., 0., 1. ) * 0.25;
    }
    if( reflectionCoefficient == 0.0 ) { // this is happening a lot.
      accumulatedColor += vec3( 1., 0., 0. ) * 0.25;
    }
    if( isnan( reflectionCoefficient ) ) {
      return vec3( 1., 0., 1. );
    }
    // check for inf
    if( reflectionCoefficient == 1.0 / 0.0 ) {
      return vec3( 0., 1., 1. );
    }

    transmission *= reflectionCoefficient;
   
    // update internal ray for next boundce
    internalRay = Ray(sphereHit.position, reflectedRayDirection);
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

