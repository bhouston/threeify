#pragma once
#pragma include <math/math>

// three.js
vec3 BRDF_Diffuse_Lambert(const vec3 albedo) {
  return albedo * RECIPROCAL_PI;

} // validated

/*
//https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#acknowledgments AppendixB
vec3 BRDF_lambertian_2(vec3 f0, vec3 f90, vec3 diffuseColor, float VdotH)
{
    // see https://seblagarde.wordpress.com/2012/01/08/pi-or-not-to-pi-in-game-lighting-equation/
    return (1. - F_Schlick(f0, f90, VdotH)) * (diffuseColor / M_PI);
}
*/
