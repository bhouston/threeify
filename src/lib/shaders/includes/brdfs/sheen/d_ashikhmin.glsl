#pragma once

float D_Ashikhmin(float NdotH, float alphaRoughness) {
  // Ashikhmin 2007, "Distribution-based BRDFs"
  float a2 = alphaRoughness * alphaRoughness;
  float cos2h = NdotH * NdotH;
  float sin2h = 1. - cos2h;
  float sin4h = sin2h * sin2h;
  float cot2 = -cos2h / (a2 * sin2h);
  return 1. / (PI * (4. * a2 + 1.) * sin4h) * (4. * exp(cot2) + sin4h);
}
