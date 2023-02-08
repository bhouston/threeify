#pragma once

// Anisotropic GGX visibility function, with height correlation.
// T: Tanget, B: Bi-tanget
float V_GGX_anisotropic(
  float NdotL,
  float NdotV,
  float BdotV,
  float TdotV,
  float TdotL,
  float BdotL,
  float anisotropy,
  float at,
  float ab
) {
  float lambdaV = NdotL * length(vec3(at * TdotV, ab * BdotV, NdotV));
  float lambdaL = NdotV * length(vec3(at * TdotL, ab * BdotL, NdotL));
  float v = 0.5 / (lambdaV + lambdaL);
  return clamp(v, 0., 1.);
}
