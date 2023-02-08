#pragma once
#pragma include <math/math>

// Microfacet Models for Refraction through Rough Surfaces - equation (34)
// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html
// alpha is "roughness squared" in Disney’s reparameterization
float V_GGX_Smith(
  const float alphaRoughness,
  const float NdotL,
  const float NdotV
) {
  // geometry term (normalized) = G(l)⋅G(v) / 4(n⋅l)(n⋅v)
  // also see #12151

  float a2 = pow2(alphaRoughness);
  float gl = NdotL + sqrt(a2 + (1. - a2) * pow2(NdotL));
  float gv = NdotV + sqrt(a2 + (1. - a2) * pow2(NdotV));

  return 1. / (gl * gv);

} // validated
