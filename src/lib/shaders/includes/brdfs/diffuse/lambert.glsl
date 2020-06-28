#pragma once
#pragma once
#pragma include <math/math>
#pragma include <brdfs/common>

// three.js
vec3 BRDF_Diffuse_Lambert(
  const in DirectIllumination directIllumination,
  const in Surface surface,
  const in vec3 albedo ) {

  float dotNL = clamp( dot( directIllumination.lightDirection, surface.normal ), 0.0, 1.0 );

	return dotNL * directIllumination.color * albedo * RECIPROCAL_PI;

} // validated


/*
// From glTF reference viewer
//https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#acknowledgments AppendixB
vec3 BRDF_lambertian(vec3 f0, vec3 f90, vec3 diffuseColor, float VdotH)
{
    // see https://seblagarde.wordpress.com/2012/01/08/pi-or-not-to-pi-in-game-lighting-equation/
    return (1.0 - F_Schlick(f0, f90, VdotH)) * (diffuseColor / M_PI);
}

*/
