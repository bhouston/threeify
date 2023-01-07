#pragma once

vec3 specularIntensityToF0( in vec3 specularIntensity ) {
  return specularIntensity * specularIntensity * 0.16;
}

vec3 F_Schlick( const in vec3 specularColor, const in float LdotH ) {

	// Original approximation by Christophe Schlick '94
	// float fresnel = pow( 1. - LdotH, 5. );

	// Optimized variant (presented by Epic at SIGGRAPH '13)
	// https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf
	float fresnel = exp2( ( -5.55473 * LdotH - 6.98316 ) * LdotH );
	return ( 1. - specularColor ) * fresnel + specularColor;

} // validated

// The following equation models the Fresnel reflectance term of the spec equation (aka F())
// Implementation of fresnel from [4], Equation 15
vec3 F_Schlick_2(vec3 f0, vec3 f90, float VdotH)
{
    return f0 + (f90 - f0) * pow(clamp(1. - VdotH, 0., 1.), 5.);
}

// Q: Where is this from?  Should we use it?
vec3 F_Schlick_RoughnessDependent( const in vec3 F0, const in float NdotV, const in float roughness ) {

	// See F_Schlick
	float fresnel = exp2( ( -5.55473 * NdotV - 6.98316 ) * NdotV );
	vec3 Fr = max( vec3( 1. - roughness ), F0 ) - F0;

	return Fr * fresnel + F0;

}
