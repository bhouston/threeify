#pragma once

#pragma import "../../math.glsl"

// The following equation(s) model the distribution of microfacet normals across the area being drawn (aka D())
// Implementation from "Average Irregularity Representation of a Roughened Surface for Ray Reflection" by T. S. Trowbridge, and K. P. Reitz
// Follows the distribution function recommended in the SIGGRAPH 2013 course notes from EPIC Games [1], Equation 3.

// Microfacet Models for Refraction through Rough Surfaces - equation (33)
// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html
// alpha is "roughness squared" in Disney’s reparameterization
float D_GGX(const float alphaRoughness, const float NdotH) {
  float a2 = pow2(alphaRoughness);
  float denom = pow2(NdotH) * (a2 - 1.0) + 1.0; // avoid alpha = 0 with NdotH = 1

  return RECIPROCAL_PI * a2 / pow2(denom);

}

