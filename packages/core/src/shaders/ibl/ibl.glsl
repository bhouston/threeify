#pragma once

#pragma include <math/math>
#pragma include <math/mat4>
#pragma include <color/encodings/rgbe>

/*struct IBLMap {
    samplerCube texture;
    vec3 intensity;
    int maxLod;
};*/

float convertGlossyExponentToSpecularRoughness( const in float glossyExponent ) {
    return sqrt( 2.0 / ( glossyExponent + 2.0 ) );
}
float convertSpecularRoughnessToGlossyExponent( const in float specularRoughness ) {
    return 2.0 / ( specularRoughness * specularRoughness ) - 2.0;
}

float getMipLevelForSpecularRoughness( const in float specularRoughness, const in int iblMapMaxLod ) {
    float glossyExponent = convertSpecularRoughnessToGlossyExponent( specularRoughness);
    // From McGuire paper on phong cubemap IBL.
    // https://casual-effects.com/research/McGuire2013CubeMap/index.html
    float MIPlevel = log2( pow( 2., float(iblMapMaxLod) ) * sqrt( 3. ) ) - 0.5 * log2( glossyExponent + 1. );

    return MIPlevel;
}

vec3 sampleIBLIrradiance( const in samplerCube iblMapTexture, const in vec3 iblMapIntensity, const in int iblMapMaxLod, const in vec3 viewNormal, const in mat4 worldToView ) {
    // convert to world
    vec3 worldNormal = mat4UntransformDirection( worldToView, viewNormal );
    vec3 iblColor = rgbeToLinear( textureLod( iblMapTexture, worldNormal, float(iblMapMaxLod) ) );
    return iblColor * iblMapIntensity;
}

vec3 sampleIBLRadiance( const in samplerCube iblMapTexture, const in vec3 iblMapIntensity, const in int iblMapMaxLod, const in vec3 viewNormal, const in vec3 viewDirection, const in mat4 worldToView, const in float specularRoughness ) {
    
    vec3 reflectDirection = reflect( viewDirection, viewNormal );
    // Mixing the reflection with the normal is more accurate and keeps rough objects from gathering light from behind their tangent plane.
    reflectDirection = normalize( mix( reflectDirection, viewNormal, pow2( specularRoughness ) ) );

    // convert to world
    vec3 worldReflectDirection = mat4UntransformDirection( worldToView, reflectDirection );

    // TODO: get the correct level from McGuire paper on phone cubemap IBL.
    float mipLevel = getMipLevelForSpecularRoughness( specularRoughness, iblMapMaxLod );
    vec3 iblColor = rgbeToLinear( textureLod( iblMapTexture, worldReflectDirection, mipLevel ) );
    return iblColor * iblMapIntensity;
}
