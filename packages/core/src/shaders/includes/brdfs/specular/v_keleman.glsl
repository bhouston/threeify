#pragma once

// https://github.com/google/filament/blob/master/shaders/src/brdf.fs#L131
float V_Kelemen(float LdotH) {
  // Kelemen 2001, "A Microfacet Based Coupled Specular-Matte BRDF Model with Importance Sampling"
  return 0.25 / (LdotH * LdotH);
}
