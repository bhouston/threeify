#pragma once
#pragma import "../../math.glsl"

// Understanding the Masking-Shadowing Function in Microfacet-Based BRDFs
// https://github.com/EpicGames/UnrealEngine/blob/release/Engine/Shaders/Private/BRDF.ush#L270-L286
float V_GGX_SmithCorrelated_Anisotropic(
  const float at,
  const float ab,
  const float NdotL,
  const float NdotV,
  const float TdotL,
  const float BdotL,
  const float TdotV,
  const float BdotV
) {
  float lambdaV = NdotL * length(vec3(at * TdotV, ab * BdotV, NdotV));
  float lambdaL = NdotV * length(vec3(at * TdotL, ab * BdotL, NdotL));
  return 0.5 / (lambdaV + lambdaL);

} // validated
