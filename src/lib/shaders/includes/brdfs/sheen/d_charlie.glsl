#pragma once

// Estevez and Kulla http://www.aconty.com/pdf/s2017_pbs_imageworks_sheen.pdf
float D_Charlie(float sheenRoughness, float dotNH) {
  sheenRoughness = max(sheenRoughness, 0.000001); //clamp (0,1]
  float alphaG = sheenRoughness * sheenRoughness;
  float invR = 1. / alphaG;
  float cos2h = dotNH * dotNH;
  float sin2h = 1. - cos2h;
  return (2. + invR) * pow(sin2h, invR * 0.5) / (2. * PI);
}
