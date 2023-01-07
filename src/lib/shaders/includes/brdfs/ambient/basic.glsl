#pragma once

vec3 BRDF_Ambient_Basic(const vec3 ambient, const vec3 albedo) {
  return ambient * albedo;

}
