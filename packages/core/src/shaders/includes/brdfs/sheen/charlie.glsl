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
vec3 BRDF_Sheen_Charlie(
  const vec3 normal,
  const vec3 viewDirection,
  const vec3 lightDirection,
  const vec3 sheenColor,
  const float sheenIntensity,
  const float sheenRoughness
) {
  vec3 halfDirection = normalize(lightDirection + viewDirection);

  float safeSheenRoughness = clamp(sheenRoughness, 0.07, 1.0);

  float NdotL = saturate(dot(normal, lightDirection));
  float NdotV = saturate(dot(normal, viewDirection));
  float NdotH = saturate(dot(normal, halfDirection));

  float sheenDistribution = D_Charlie(safeSheenRoughness, NdotH);
  float sheenVisibility = V_Charlie(safeSheenRoughness, NdotL, NdotV);

  return sheenColor * sheenIntensity * sheenDistribution * sheenVisibility;

}
