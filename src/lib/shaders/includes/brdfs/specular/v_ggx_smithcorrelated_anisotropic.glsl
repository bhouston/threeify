#pragma once
#pragma include <math/math>

// Understanding the Masking-Shadowing Function in Microfacet-Based BRDFs
// https://github.com/EpicGames/UnrealEngine/blob/release/Engine/Shaders/Private/BRDF.ush#L270-L286
float V_GGX_SmithCorrelated_Anisotropic( const in float at, const in float ab, const in float NdotL, const in float NdotV, const in float TdotL, const in float BdotL, const in float TdotV, const in float BdotV ) {

    float lambdaV = NdotL * length(vec3(at * TdotV, ab * BdotV, NdotV));
    float lambdaL = NdotV * length(vec3(at * TdotL, ab * BdotL, NdotL));
    return 0.5 / (lambdaV + lambdaL);

} // validated
