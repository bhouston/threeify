#pragma once

vec2 decodeDirection( vec2 value ) {
  return value * 2. - 1.;
}

// based on filament
void specularAnisotropicBentNormal( inout Surface surface, const float anisotropyStrength, const float roughnessFactor) {
  vec3  anisotropicTangent  = cross(surface.tangent, surface.viewDirection);
  vec3  anisotropicNormal   = cross(anisotropicTangent, surface.tangent);
  surface.normal = normalize(mix(surface.normal, anisotropicNormal, anisotropyStrength));
}
