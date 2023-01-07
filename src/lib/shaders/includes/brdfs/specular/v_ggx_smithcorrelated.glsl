#pragma once
#pragma include <math/math>

// Moving Frostbite to Physically Based Rendering 3.0 - page 12, listing 2
// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float V_GGX_SmithCorrelated( const in float alphaRoughness, const in float NdotL, const in float NdotV ) {

	// NdotL and NdotV are explicitly swapped. This is not a mistake.
	float a2 = pow2( alphaRoughness );
	float gv = NdotL * sqrt( a2 + ( 1. - a2 ) * pow2( NdotV ) );
	float gl = NdotV * sqrt( a2 + ( 1. - a2 ) * pow2( NdotL ) );

	return 0.5 / max( gv + gl, EPSILON );

} // validated
