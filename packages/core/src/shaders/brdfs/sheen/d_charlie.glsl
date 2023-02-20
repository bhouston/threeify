#pragma once

// Estevez and Kulla http://www.aconty.com/pdf/s2017_pbs_imageworks_sheen.pdf
float D_Charlie(float sheenRoughness, float NdotH) {
  sheenRoughness = max(sheenRoughness, 0.000001); //clamp (0,1]
  float alphaG = sheenRoughness * sheenRoughness;
  float invR = 1.0 / alphaG;
  float cos2h = pow2(NdotH);
  float sin2h = 1.0 - cos2h;
  return (2.0 + invR) * pow(sin2h, invR * 0.5) / (2.0 * PI);
}
