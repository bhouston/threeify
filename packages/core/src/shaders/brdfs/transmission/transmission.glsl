#pragma once

#include <brdf/specular/ggx_ibl>

vec3 getVolumeTransmissionRay( const in vec3 worldNormal, const in vec3 worldViewDirection, const in float localThickness, const in float ior, const in mat4 localToWorld ) {
    // Compute rotation-independant scaling of the model matrix, The thickness is specified in local space.
    vec3 localToWorldScale = mat4ToScale3( localToWorld );
    float worldThickness = localThickness * localToWorldScale;

    // Direction of refracted light.
    vec3 refractionVector = refract( -worldViewDirection, normalize( worldNormal ), 1.0 / ior );
    return normalize( refractionVector ) * worldThickness;
}

// Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and
// an IOR of 1.5 results in the default amount of microfacet refraction.
float applyIorToRoughness( const in float specularRoughness, const in float ior ) {
    return specularRoughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
}

// TODO: use gl_FragCoord instead of fragCoord.
vec4 getTransmissionSample( const in sample2D backgroundTexture, const in vec2 fragCoord, const in float specularRoughness, const in float ior ) {
    float backgroundLod = log2( textureSize( backgroundTexture, 0 ) ) * applyIorToRoughness( specularRoughness, ior );
    return textureLod( backgroundTexture, fragCoord, backgroundLod );
}

vec3 getVolumeAttenuation( const in float distance, const in vec3 attenuationColor, const in float attenuationDistance ) {
    // Attenuation distance is +∞, i.e. the transmitted color is not attenuated at all.
    if( isinf( attenuationDistance ) )
        return 1.;

    // Beer's law https://en.wikipedia.org/wiki/Beer%E2%80%93Lambert_law
    vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
    return exp( -attenuationCoefficient * distance );
}

vec4 BTDF_TransmissionAttenuation( const in vec3 worldNormal, const in vec3 worldViewDirection, const in vec3 worldPosition, const in mat4 localToWorld, const in mat4 worldToView, const in mat4 viewToScreen, const in vec3 albedo, const in vec3 specularF0, const in float specularF90, const in float ior, const in float specularRoughness, const in float localThickness, const in vec3 attenuationColor, const in float attenuationDistance, onst in sample2D backgroundTexture ) {

    vec3 transmissionRay = getVolumeTransmissionRay( worldNormal, worldViewDirection, localThickness, ior, localToWorld );
    vec3 refractedRayExit = worldPosition + transmissionRay;

    // Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
    vec4 ndcPos = viewToScreen * worldToView * vec4( refractedRayExit, 1.0 );
    vec2 refractionCoords = ndcPos.xy / ndcPos.w;
    refractionCoords += 1.0;
    refractionCoords /= 2.0;

    // Sample framebuffer to get pixel the refracted ray hits.
    vec4 transmittedLight = getTransmissionSample( backgroundTexture, refractionCoords, specularRoughness, ior );
    vec3 attenuatedColor = transmittedLight * getVolumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );

    // Get the specular component.
    vec3 F = BRDF_Specular_GGX_IBL( worldNormal, worldViewDirection, specularF0, specularF90, specularRoughness );

    return vec4( ( 1.0 - F ) * attenuatedColor * albedo, transmittedLight.a );
}
