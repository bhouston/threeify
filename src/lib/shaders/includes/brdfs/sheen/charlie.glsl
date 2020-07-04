//
// based on glTF Sample Viewer & Sheen glTF specification
//

//Sheen implementation-------------------------------------------------------------------------------------
// See  https://github.com/sebavan/glTF/tree/KHR_materials_sheen/extensions/2.0/Khronos/KHR_materials_sheen

#pragma once
#pragma include <math/math>
#pragma include "d_charlie"
#pragma include "v_charlie"

// f_sheen
vec3 BRDF_Sheen_Charlie( const in Surface surface, vec3 lightDirection, vec3 sheenColor, float sheenIntensity, float sheenRoughness ) {
	vec3 halfDirection = normalize( lightDirection + surface.viewDirection );

  sheenRoughness = clamp( sheenRoughness, 0.07, 1. );

	float dotNL = saturate( dot( surface.normal, lightDirection ) );
	float dotNV = saturate( dot( surface.normal, surface.viewDirection ) );
	float dotNH = saturate( dot( surface.normal, halfDirection ) );

  float sheenDistribution = D_Charlie(sheenRoughness, dotNH);
  float sheenVisibility = V_Charlie(sheenRoughness, dotNL, dotNV);

  return sheenColor * sheenIntensity * sheenDistribution * sheenVisibility;

}
