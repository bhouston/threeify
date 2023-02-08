#pragma once

// https://dassaultsystemes-technology.github.io/EnterprisePBRShadingModel/spec-2021x.md.html#components/sheen
// https://www.shadertoy.com/view/wl3SWs
float L(float x, float r) {
  r = saturate(r);
  r = 1. - (1. - r) * (1. - r);

  float a = mix(25.3245, 21.5473, r);
  float b = mix(3.32435, 3.82987, r);
  float c = mix(0.16801, 0.19823, r);
  float d = mix(-1.27393, -1.9776, r);
  float e = mix(-4.85967, -4.32054, r);

  return a / (1. + b * pow(x, c)) + d * x + e;
}

// https://dassaultsystemes-technology.github.io/EnterprisePBRShadingModel/spec-2021x.md.html#components/sheen
// https://www.shadertoy.com/view/wl3SWs
float V_Charlie(float sheenRoughness, float NdotL, float NdotV) {
  float r = sheenRoughness;
  float visV =
    NdotV < 0.5
      ? exp(L(NdotV, r))
      : exp(2. * L(0.5, r) - L(1. - NdotV, r));
  float visL =
    NdotL < 0.5
      ? exp(L(NdotL, r))
      : exp(2. * L(0.5, r) - L(1. - NdotL, r));

  return 1. / ((1. + visV + visL) * (4. * NdotV * NdotL));
}
