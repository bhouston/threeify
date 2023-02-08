#pragma once

// https://github.com/google/filament/blob/master/shaders/src/brdf.fs
float V_Neubelt(float NdotL, float NdotV) {
  // Neubelt and Pettineo 2013, "Crafting a Next-gen Material Pipeline for The Order: 1886"
  return saturate(1. / (4. * (NdotL + NdotV - NdotL * NdotV)));
}
