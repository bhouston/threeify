#pragma once


#define NUM_PLANES 40

bool rayPlanesIntersection( Ray incidentRay, in Plane planes[NUM_PLANES], int numPlanes, out Hit hit ) {
  int hitCount = 0;

  for( int i = 0; i < numPlanes; i ++ ) {
    Plane plane = planes[i];

    Hit planeHit;
    if( rayPlaneIntersection(incidentRay, plane, planeHit) ) {    
      if( ( hitCount == 0 ) || ( planeHit.distance > 0. && planeHit.distance < hit.distance ) ) {
        hit = planeHit;
        hitCount++;
      }
    }
  }

  return hitCount > 0;
}

void toPlanes( in vec3 pointOnPlane[NUM_PLANES], in vec3 planeNormal[NUM_PLANES], out Plane planes[NUM_PLANES] ) {
  for( int i = 0; i < NUM_PLANES; i ++ ) {
    planes[i] = Plane(pointOnPlane[i], planeNormal[i]);
  }
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

vec3 rayTraceTransmission_Planes(
  Ray incidentRay, // local 
  Hit surfaceHit, // local
  Sphere gemSphere, // local
  float gemIOR,
  vec3 attenuationCoefficient,
  in Plane planes[NUM_PLANES],
  int numPlanes,
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
    Hit facetHit;
    if ( !rayPlanesIntersection(internalRay, planes, numPlanes, facetHit) ) {
      return vec3( 1., 0., 0. );
    }
    //return vec3( 0., 1., 0 );

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

