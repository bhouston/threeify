#pragma once

vec2 decodeDirection( vec2 value ) {
  return value * 2. - 1.;
}

// based on filament
vec3 bendNormalForAnistropicReflections( vec3 viewDirection, mat3 tangentToView, const float anisotropyStrength, const float roughnessFactor) {
  vec3 tangent = tangentToView[0];
  vec3 normal = tangentToView[2];

  vec3  anisotropicTangent  = cross(tangent, viewDirection);
  vec3  anisotropicNormal   = cross(anisotropicTangent, tangent);
  return normalize(mix(normal, anisotropicNormal, anisotropyStrength));
}
