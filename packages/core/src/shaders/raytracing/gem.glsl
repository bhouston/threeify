#pragma once

#pragma import "./raytracing.glsl"
#pragma import "./refraction.glsl"
#pragma import "./sphere.glsl"
#pragma import "../microgeometry/normalPacking.glsl"
#pragma import "../math/mat4.glsl"


float fresnelReflection( vec3 incidentRay, vec3 surfaceNormal, float eta ) {
    float cosTheta = dot( incidentRay, surfaceNormal );
    float sinTheta = sqrt( 1.0 - cosTheta * cosTheta );
    float sinThetaPrime = eta * sinTheta;
    float cosThetaPrime = sqrt( 1.0 - sinThetaPrime * sinThetaPrime );
    float rParallel = ( cosTheta - eta * cosThetaPrime ) / ( cosTheta + eta * cosThetaPrime );
    float rPerpendicular = ( eta * cosTheta - cosThetaPrime ) / ( eta * cosTheta + cosThetaPrime );
    return ( rParallel * rParallel + rPerpendicular * rPerpendicular ) / 2.0;
}

vec3 rayTraceTransmission( Ray incidentRay, vec3 gemNormal, float gemIOR, mat4 localToWorld, samplerCube iblCubeMap ) {
  //  vec3 gemReflection = reflect( incidentRay.direction, gemNormal );
    vec3 gemRefraction = refract( incidentRay.direction, gemNormal, 1.0 / gemIOR );

    //vec3 gemReflectColor = texture( iblCubeMap, gemReflection, 0.0 ).rgb;
    vec3 worldGemRefraction = mat4TransformDirection(localToWorld, gemRefraction);

    vec3 gemRefractionColor = texture( iblCubeMap, worldGemRefraction, 0.0 ).rgb;

    // calculate fresnel reflection and transmission
    //float fresnel = fresnelReflection( incidentRay.direction, gemNormal, 1.0 / gemIOR );
    //gemReflectColor *= fresnel;
    //gemRefractionColor *= ( 1.0 - fresnel );


    return gemRefractionColor;
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