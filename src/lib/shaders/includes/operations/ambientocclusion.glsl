#pragma once
#pragma include <math/math>

// reads channel R, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
// ao = texture2D( aoMap, vUv2 ).r
float ambientOcclusion( float ao, float aoIntensity ) {
	return ( ao - 1. ) * aoMapIntensity + 1.;
}

// ref: https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float specularOcclusion( const in float NdotV, const in float ambientOcclusion, const in float roughness ) {

	return saturate( pow( NdotV + ambientOcclusion, exp2( - 16. * roughness - 1. ) ) - 1. + ambientOcclusion );

}
