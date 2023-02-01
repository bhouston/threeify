#pragma once

#pragma include <math/math>
#pragma include <math/mat4>

/*struct IBLMap {
    samplerCube texture;
    vec3 intensity;
    int maxLod;
};*/

vec3 sampleIBLIrradiance( const in samplerCube iblMapTexture, const in vec3 iblMapIntensity, const in int iblMapMaxLod, const in vec3 viewNormal, const in mat4 worldToView ) {
    // convert to world
    vec3 worldNormal = mat4UntransformDirection( worldToView, viewNormal );
    vec4 iblColor = textureLod( iblMapTexture, worldNormal, float(iblMapMaxLod) );
    return iblColor.rgb * iblMapIntensity;
}

vec3 sampleIBLRradiance( const in samplerCube iblMapTexture, const in vec3 iblMapIntensity, const in int iblMapMaxLod, const in vec3 viewNormal, const in vec3 viewDirection, const in mat4 worldToView, const in float specularRoughness ) {
    
    vec3 reflectDirection = reflect( -viewDirection, viewNormal );
    // Mixing the reflection with the normal is more accurate and keeps rough objects from gathering light from behind their tangent plane.
    reflectDirection = normalize( mix( reflectDirection, viewNormal, pow2( specularRoughness ) ) );

    // convert to world
    vec3 worldReflectDirection = mat4UntransformDirection( worldToView, reflectDirection );

    // TODO: get the correct level from McGuire paper on phone cubemap IBL.
    float lodLevel = specularRoughness * float(iblMapMaxLod); 
    vec4 iblColor = textureLod( iblMapTexture, worldReflectDirection, lodLevel );
    return iblColor.rgb * iblMapIntensity;
}
