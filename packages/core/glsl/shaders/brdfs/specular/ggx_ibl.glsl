#pragma once
#pragma import "../../math.glsl"

// this is taken from three.js, 2023-02-01

// Analytical approximation of the DFG LUT, one half of the
// split-sum approximation used in indirect specular lighting.
// via 'environmentBRDF' from "Physically Based Shading on Mobile"
// https://www.unrealengine.com/blog/physically-based-shading-on-mobile
vec2 DFGApprox(
  const vec3 viewNormal,
  const vec3 viewDir,
  const float specularRoughness
) {
  float dotNV = saturate(dot(viewNormal, viewDir));

  const vec4 c0 = vec4(-1, -0.0275, -0.572, 0.022);
  const vec4 c1 = vec4(1, 0.0425, 1.04, -0.04);

  vec4 r = specularRoughness * c0 + c1;

  float a004 = min(r.x * r.x, exp2(-9.28 * dotNV)) * r.x + r.y;
  vec2 fab = vec2(-1.04, 1.04) * a004 + r.zw;

  return fab;
}

vec3 BRDF_Specular_GGX_IBL(
  const vec3 viewNormal,
  const vec3 viewDir,
  const vec3 specularF0,
  const vec3 specularF90,
  const float specularRoughness
) {
  vec2 fab = DFGApprox(viewNormal, viewDir, specularRoughness);
  return specularF0 * fab.x + specularF90 * fab.y;
}

// Fdez-Agüera's "Multiple-Scattering Microfacet Model for Real-Time Image Based Lighting"
// Approximates multiscattering in order to preserve energy.
// http://www.jcgt.org/published/0008/01/03/
void BRDF_Specular_GGX_Multiscatter_IBL(
  const vec3 viewNormal,
  const vec3 viewDir,
  const vec3 specularF0,
  const vec3 specularF90,
  const float specularRoughness,
  out vec3 singleScatter,
  out vec3 multiScatter
) {
  vec2 fab = DFGApprox(viewNormal, viewDir, specularRoughness);

  vec3 FssEss = specularF0 * fab.x + specularF90 * fab.y;

  float Ess = fab.x + fab.y;
  float Ems = 1.0 - Ess;

  vec3 Favg = specularF0 + (1.0 - specularF0) * 0.047619; // 1/21
  vec3 Fms = FssEss * Favg / (1.0 - Ems * Favg);

  singleScatter = FssEss;
  multiScatter = Fms * Ems;
}
