#pragma once
#pragma import "../../math.glsl"

// source: Three.js 2023-02-01
// This is a curve-fit approxmation to the "Charlie sheen" BRDF integrated over the hemisphere from
// Estevez and Kulla 2017, "Production Friendly Microfacet Sheen BRDF". The analysis can be found
// in the Sheen section of https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
vec3 BRDF_Sheen_Charlie_IBL(
  const vec3 viewNormal,
  const vec3 viewDirection,
  const vec3 sheenColor,
  const float sheenRoughness
) {
  float dotNV = saturate(dot(viewNormal, viewDirection));
  float r2 = pow2(sheenRoughness);
  float a =
    sheenRoughness < 0.25
      ? -339.2 * r2 + 161.4 * sheenRoughness - 25.9
      : -8.48 * r2 + 14.3 * sheenRoughness - 9.95;
  float b =
    sheenRoughness < 0.25
      ? 44.0 * r2 - 23.7 * sheenRoughness + 3.26
      : 1.97 * r2 - 3.27 * sheenRoughness + 0.72;
  float DG =
    exp(a * dotNV + b) +
    (sheenRoughness < 0.25
      ? 0.0
      : 0.1 * (sheenRoughness - 0.25));

  return sheenColor * saturate(DG);
}
