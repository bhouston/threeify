#pragma once

#pragma import "../../math.glsl"

// Moving Frostbite to Physically Based Rendering 3. - page 12, listing 2
// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float V_GGX_SmithCorrelated(
  const float alphaRoughness,
  const float NdotL,
  const float NdotV
) {
  // NdotL and NdotV are explicitly swapped. This is not a mistake.
  float a2 = pow2(alphaRoughness);
  float gv = NdotL * sqrt(a2 + (1.0 - a2) * pow2(NdotV));
  float gl = NdotV * sqrt(a2 + (1.0 - a2) * pow2(NdotL));

  return 0.5 / max(gv + gl, EPSILON);

} // validated
