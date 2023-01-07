#pragma once
#pragma include <math/math>
#pragma include "f_schlick"
#pragma include "v_ggx_smithcorrelated_anisotropic"
#pragma include "d_ggx_anisotropic"

// GGX Distribution, Schlick Fresnel, GGX-Smith Visibility
vec3 BRDF_Specular_GGX_Anisotropic(
  const in vec3 normal,
  const in vec3 viewDirection,
  const in vec3 lightDirection,
  const in vec3 F0,
  const in vec3 F90,
  const in float specularRoughness,
  const in vec3 anisotropyT,
  const in vec3 anisotropyB,
  const in float anisotropy ) {

  // Roughness along tangent and bitangent.
  // Christopher Kulla and Alejandro Conty. 2017. Revisiting Physically Based Shading at Imageworks
  float alphaRoughness = pow2(specularRoughness); // UE4's roughness

	vec3 halfDirection = normalize(lightDirection + viewDirection);

	float NdotL = saturate( dot( normal, lightDirection ) );
	float NdotV = saturate( dot( normal, viewDirection ) );
	float NdotH = saturate( dot( normal, halfDirection ) );

	float TdotL = saturate( dot( anisotropyT, lightDirection ) );
	float TdotV = saturate( dot( anisotropyT, viewDirection ) );
	float TdotH = saturate( dot( anisotropyT, halfDirection ) );

	float BdotL = saturate( dot( anisotropyB, lightDirection ) );
	float BdotV = saturate( dot( anisotropyB, viewDirection ) );
	float BdotH = saturate( dot( anisotropyB, halfDirection ) );

	float VdotH = saturate( dot( viewDirection, halfDirection) );

	float at = max(alphaRoughness * (1. + anisotropy), 0.00001);
  float ab = max(alphaRoughness * (1. - anisotropy), 0.00001);

  vec3 F = F_Schlick_2(F0, F90, VdotH);
  float V = V_GGX_SmithCorrelated_Anisotropic(
    at, ab,
    NdotL, NdotV,
    TdotL, TdotV,
    BdotL, BdotV );
  float D = D_GGX_anisotropic(
    at, ab,
    NdotH, TdotH, BdotH);

  return F * ( V * D ) * PI;
}
