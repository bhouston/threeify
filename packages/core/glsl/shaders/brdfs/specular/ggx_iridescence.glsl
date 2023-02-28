#pragma once

#pragma import "./fresnel.glsl"
#pragma import "./v_ggx_smithcorrelated.glsl"
#pragma import "./d_ggx.glsl"

// from Three.js - need to research this.
vec3 BRDF_GGX_Iridescence(
  const vec3 normal,
  const vec3 viewDir,
  const vec3 lightDir,
  const vec3 f0,
  const float f90,
  const float iridescence,
  const vec3 iridescenceFresnel,
  const float roughness
) {
  float alpha = pow2(roughness); // UE4's roughness

  vec3 halfDir = normalize(lightDir + viewDir);

  float dotNL = saturate(dot(normal, lightDir));
  float dotNV = saturate(dot(normal, viewDir));
  float dotNH = saturate(dot(normal, halfDir));
  float dotVH = saturate(dot(viewDir, halfDir));

  vec3 F = mix(F_Schlick(f0, f90, dotVH), iridescenceFresnel, iridescence);

  float V = V_GGX_SmithCorrelated(alpha, dotNL, dotNV);

  float D = D_GGX(alpha, dotNH);

  return F * (V * D);

}
