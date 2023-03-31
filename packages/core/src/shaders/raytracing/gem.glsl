#pragma once

#pragma import "./raytracing.glsl"
#pragma import "./refraction.glsl"
#pragma import "./sphere.glsl"
#pragma import "../microgeometry/normalPacking.glsl"
#pragma import "../math/mat4.glsl"
#pragma import "../brdfs/specular/fresnel.glsl"
#pragma import "./plane.glsl"

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

Hit sphereHitToGeoHit( Ray incidentRay, Hit sphereHit, vec3 squishFactor, samplerCube normalCubeMap, int hitRefines ) {
  Hit bestHit = sphereHit;
  if( hitRefines == 0 ) {
     vec4 cubeSample = texture(normalCubeMap, normalize( bestHit.position ), 0.0);
    bestHit.normal = colorToNormal(cubeSample.rgb);
    return bestHit;
  }

  for( int i = 0; i < hitRefines; i ++ ) {
    // using the location of the hit on the sphere, get the geometry normal + distance from the cube mpa
    vec4 cubeSample = texture(normalCubeMap, normalize( bestHit.position ), 0.0);
    float facetDistanceFromSphere = cubeSample.a;
    vec3 facetNormal = colorToNormal(cubeSample.rgb);

    vec3 facetPosition = facetNormal * facetDistanceFromSphere;
  
    // create a plane from the normal and distance
    Plane facetPlane = Plane(facetPosition, facetNormal);

    Hit facetHit;
    if( ! rayPlaneIntersection(incidentRay, facetPlane, facetHit) ) {
      return bestHit;
    }

    if( facetHit.distance < 0.0001 || facetHit.distance > bestHit.distance ) {
      return bestHit;
    }
    
    // if the ray hits the plane, adjust the ray to the hit location
    bestHit = facetHit;
  }

  return bestHit;
}


vec3 localDirectionToIBLSample(
  vec3 localDirection,
  mat4 localToWorld,
  samplerCube iblWorldMap
) {
  vec3 worldDirection = mat4TransformDirection(localToWorld, localDirection);
  return texture(iblWorldMap, worldDirection, 0.0).rgb;
}

#define DEBUG_EXTERNAL_REFLECTION
#define DEBUG_EXTERNAL_REFRACTION
//#define DEBUG_OUTPUT_FIRST_BOUNCE
#define DEBUG_INTERNAL_ATTENUATION
//#define DEBUG_USE_CUBEMAP_NORMALS
//#define DEBUG_OUTPUT_COLORS
#define DEBUG_BOOST
#define DEBUG_FACET_HIT_CORRECTION
//#define DEBUG_OUTPUT_HIT_NORMALS

vec3 rayTraceTransmission(
  Ray incidentRay, // local 
  Hit surfaceHit, // local
  Sphere gemSphere, // local
  float gemIOR,
  vec3 attenuationCoefficient,
  samplerCube gemNormalCubeMap, // local
  vec3 squishFactor,
  float boostFactor,
  int maxBounces,
  int hitRefines,
  mat4 localToWorld,
  samplerCube iblWorldMap // world
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

#ifdef DEBUG_EXTERNAL_REFLECTION

  accumulatedColor += reflectionCoefficient * iblColor;

#endif DEBUG_EXTERNAL_REFLECTION

  float transmissionCoefficient = 1.0 - reflectionCoefficient;
  transmission *= transmissionCoefficient;

#ifdef DEBUG_EXTERNAL_REFRACTION
  iblColor = localDirectionToIBLSample( refractedRayDirection, localToWorld, iblWorldMap );
  accumulatedColor += transmission * iblColor;
#endif DEBUG_EXTERNAL_REFRACTION

#ifdef DEBUG_OUTPUT_FIRST_BOUNCE
  return accumulatedColor;
#endif DEBUG_OUTPUT_FIRST_BOUNCE

  for (int bounce = 0; bounce < maxBounces; bounce++) {
    Hit sphereHit;
    if (
      !raySphereIntersection(internalRay, gemSphere, sphereHit) || sphereHit.distance <= 0.0001
    ) {
      break;
    }

    Hit facetHit = sphereHit;
#ifdef DEBUG_FACET_HIT_CORRECTION
    facetHit = sphereHitToGeoHit(internalRay, sphereHit, squishFactor, gemNormalCubeMap, hitRefines);

    /*// map sphere normal to gem normal - appers to be correct.
    facetHit.normal = colorToNormal(
      texture(gemNormalCubeMap, normalize( facetHit.normal ), 0.0).rgb
    );*/

#endif DEBUG_FACET_HIT_CORRECTION

#ifdef DEBUG_OUTPUT_HIT_NORMALS
    if( bounce == (maxBounces - 1 ) ) {
      return normalToColor( facetHit.normal );
    }
#endif DEBUG_OUTPUT_HIT_NORMALS

/*
#ifdef DEBUG_USE_CUBEMAP_NORMALS
    // map sphere normal to gem normal - appers to be correct.
    facetHit.normal = colorToNormal(
      texture(gemNormalCubeMap, normalize( facetHit.normal * squishFactor), 0.0).rgb
    );
#endif DEBUG_USE_CUBEMAP_NORMALS
*/

#ifdef DEBUG_INTERNAL_ATTENUATION
    // Apply absorption and update accumulated transmission
    //float distance = length(facetHit.position - internalRay.origin);
    transmission *= exp(-facetHit.distance * attenuationCoefficient);
#endif DEBUG_INTERNAL_ATTENUATION

    // calculate fresnel reflection and transmission
    reflectionCoefficient = fresnelReflection(
      internalRay.direction, // validated
      facetHit.normal, // validated
      1.0 / gemIOR // validated
    );

    // internal reflection
    reflectedRayDirection = reflect(
      internalRay.direction, // validated
      -facetHit.normal // validated
    );

    // interal->external reflection
    refractedRayDirection = refract(
        internalRay.direction, // validated
        -facetHit.normal, // validated
        gemIOR / 1.0 // validated
      );
      //refractedRayDirection = internalRay.direction;

    transmissionCoefficient = 1.0 - reflectionCoefficient;
   
    if( transmissionCoefficient >= 0.0001 ) {
        vec3 iblColor = localDirectionToIBLSample( refractedRayDirection, localToWorld, iblWorldMap );
        accumulatedColor += transmission * transmissionCoefficient * iblColor;
    }

    
#ifdef DEBUG_OUTPUT_COLORS
    if( reflectionCoefficient == 1.0 ) { 
      accumulatedColor += vec3( 0., 0., 1. ) * 0.25;
    }
    if( reflectionCoefficient == 0.0 ) { // this is happening a lot.
      //accumulatedColor += vec3( 1., 0., 0. ) * 0.25;
      break;
    }
#endif DEBUG_OUTPUT_COLORS
    if( isnan( reflectionCoefficient ) ) {
      return vec3( 1., 0., 1. );
    }
    // check for inf
    if( reflectionCoefficient == 1.0 / 0.0 ) {
      return vec3( 0., 1., 1. );
    }

    transmission *= pow( reflectionCoefficient, 1.0 / ( 1.0 + boostFactor ) );
   
    // update internal ray for next boundce
    internalRay = Ray(facetHit.position, reflectedRayDirection);
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

