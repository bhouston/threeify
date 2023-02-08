#pragma once

vec3 specularIntensityToF0(vec3 specularIntensity) {
  return specularIntensity * specularIntensity * 0.16;
}

vec3 F_Schlick(const vec3 specularColor, const float LdotH) {
  // Original approximation by Christophe Schlick '94
  // float fresnel = pow( 1. - LdotH, 5. );

  // Optimized variant (presented by Epic at SIGGRAPH '13)
  // https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf
  float fresnel = exp2((-5.55473 * LdotH - 6.98316) * LdotH);
  return (1. - specularColor) * fresnel + specularColor;

} // validated

// The following equation models the Fresnel reflectance term of the spec equation (aka F())
// Implementation of fresnel from [4], Equation 15
vec3 F_Schlick_2(vec3 f0, vec3 f90, float VdotH) {
  return f0 + (f90 - f0) * pow(clamp(1. - VdotH, 0., 1.), 5.);
}

// Q: Where is this from?  Should we use it?
vec3 F_Schlick_RoughnessDependent(
  const vec3 F0,
  const float NdotV,
  const float roughness
) {
  // See F_Schlick
  float fresnel = exp2((-5.55473 * NdotV - 6.98316) * NdotV);
  vec3 Fr = max(vec3(1. - roughness), F0) - F0;

  return Fr * fresnel + F0;

}

// validated from KHR_material_ior, https://github.com/KhronosGroup/glTF/blob/main/extensions/2./Khronos/KHR_materials_ior/README.md
float iorToF0(const float ior) {
  return pow2((ior - 1.) / (ior + 1.));
}

// validated from KHR_material_specular, https://github.com/KhronosGroup/glTF/blob/main/extensions/2./Khronos/KHR_materials_specular/README.md
vec3 fresnelMix(
  const vec3 f0,
  const vec3 f90,
  const float VdotH,
  const float weight,
  const vec3 base,
  const vec3 layer
) {
  vec3 fresnelWeight = F_Schlick_2(f0, f90, VdotH);
  return (1. - weight * fresnelWeight) * base + weight * fresnelWeight * layer;
}
