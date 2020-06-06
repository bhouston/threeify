#include <math/math>

// reads channel R, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
// ao = texture2D( aoMap, vUv2 ).r
float ambientOcclusion( float ao, float aoIntensity ) {
	return ( ao - 1.0 ) * aoMapIntensity + 1.0;
}

// ref: https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float specularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {

	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );

}
