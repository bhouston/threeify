//
// based on glTF Sample Viewer & Sheen glTF specification
//

//Sheen implementation-------------------------------------------------------------------------------------
// See  https://github.com/sebavan/glTF/tree/KHR_materials_sheen/extensions/2.0/Khronos/KHR_materials_sheen

#pragma once
#pragma include <math/math>
#pragma include "d_ashikhmin"
#pragma include "v_ashikhmin"

// f_sheen
vec3 BRDF_Sheen_Ashikhmin(
  const in vec3 normal,
  const in vec3 viewDirection,
  const in vec3 lightDirection,
  const in vec3 sheenColor,
  const in float sheenIntensity,
  const in float sheenRoughness ) {
	vec3 halfDirection = normalize( lightDirection + viewDirection );

  sheenRoughness = clamp( sheenRoughness, 0.07, 1. );

	float dotNL = saturate( dot( normal, lightDirection ) );
	float dotNV = saturate( dot( normal, viewDirection ) );
	float dotNH = saturate( dot( normal, halfDirection ) );

  float sheenDistribution = D_Ashikhmin(sheenRoughness, dotNH);
  float sheenVisibility = V_Ashikhmin(dotNL, dotNV);

  return sheenColor * sheenIntensity * sheenDistribution * sheenVisibility;

}
