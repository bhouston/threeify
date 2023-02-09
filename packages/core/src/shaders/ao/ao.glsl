#pragma once
#pragma include <math/math>

// reads channel R, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
// ao = texture( aoMap, vUv2 ).r
float ambientOcclusion(float ao, float aoMapIntensity) {
  return (ao - 1.) * aoMapIntensity + 1.;
}

// ref: https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float specularOcclusion(
  const float dotNV,
  const float ambientOcclusion,
  const float specularRoughness
) {
  return saturate(
    pow(dotNV + ambientOcclusion, exp2(-16. * specularRoughness - 1.)) -
      1. +
      ambientOcclusion
  );

}
