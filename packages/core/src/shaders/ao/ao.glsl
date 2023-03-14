#pragma once
#pragma import "../math.glsl"

// reads channel R, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
// ao = texture( aoMap, vUv2 ).r
float ambientOcclusion(float ao, float aoMapIntensity) {
  return (ao - 1.0) * aoMapIntensity + 1.0;
}

// ref: https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float specularOcclusion(
  const float dotNV,
  const float ambientOcclusion,
  const float specularRoughness
) {
  return saturate(
    safePow( dotNV + ambientOcclusion, exp2(-16.0 * specularRoughness - 1.0)) -
      1.0 +
      ambientOcclusion
  );

}
