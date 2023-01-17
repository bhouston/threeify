#pragma once
#pragma include <math/math>
#pragma include "f_schlick"
#pragma include "v_ggx_smithcorrelated"
#pragma include "d_ggx"

// GGX Distribution, Schlick Fresnel, GGX-Smith Visibility
vec3 BRDF_Specular_GGX(
  const vec3 normal,
  const vec3 viewDirection,
  const vec3 lightDirection,
  const vec3 F0,
  const vec3 F90,
  const float specularRoughness,
  out vec3 remainingWeight
) {
  float alphaRoughness = pow2(specularRoughness); // UE4's roughness

  vec3 halfDirection = normalize(lightDirection + viewDirection);

  float NdotL = saturate(dot(normal, lightDirection));
  float NdotV = saturate(dot(normal, viewDirection));
  float NdotH = saturate(dot(normal, halfDirection));
  float VdotH = saturate(dot(viewDirection, halfDirection));

  vec3 F = F_Schlick_2(F0, F90, VdotH);
  float V = V_GGX_SmithCorrelated(alphaRoughness, NdotL, NdotV);
  float D = D_GGX(alphaRoughness, NdotH);

  remainingWeight = vec3(1. - max( max(F.x, F.y), F.z ) );

  return F * (V * D) * PI;

} // validated
