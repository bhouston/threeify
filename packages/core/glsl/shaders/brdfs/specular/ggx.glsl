#pragma once
#pragma import "../../math.glsl"
#pragma import "./fresnel.glsl"
#pragma import "./v_ggx_smithcorrelated.glsl"
#pragma import "./d_ggx.glsl"

// GGX Distribution, Schlick Fresnel, GGX-Smith Visibility
vec3 BRDF_Specular_GGX(
  const vec3 normal,
  const vec3 viewDirection,
  const vec3 lightDirection,
  const vec3 F0,
  const vec3 F90,
  const float specularRoughness
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

  return F * (V * D) * PI;

} // validated

// GGX Distribution, Schlick Fresnel, GGX-Smith Visibility
float BRDF_Specular_GGX_NoFrenel(
  const vec3 normal,
  const vec3 viewDirection,
  const vec3 lightDirection,
  const float specularRoughness
) {
  float alphaRoughness = pow2(specularRoughness); // UE4's roughness

  vec3 halfDirection = normalize(lightDirection + viewDirection);

  float NdotL = saturate(dot(normal, lightDirection));
  float NdotV = saturate(dot(normal, viewDirection));
  float NdotH = saturate(dot(normal, halfDirection));

  float V = V_GGX_SmithCorrelated(alphaRoughness, NdotL, NdotV);
  float D = D_GGX(alphaRoughness, NdotH);

  return V * D * PI;

} // validated

