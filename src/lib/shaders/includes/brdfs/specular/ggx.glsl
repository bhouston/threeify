#pragma once
#pragma include <math/math>
#pragma include "f_schlick"
#pragma include "g_ggx_smithcorrelated"
#pragma include "d_ggx"

// GGX Distribution, Schlick Fresnel, GGX-Smith Visibility
vec3 BRDF_Specular_GGX( const in DirectIllumination directIllumination, const in Surface surface, const in vec3 specularColor, const in float specularRoughness ) {
	float alpha = pow2( specularRoughness ); // UE4's roughness

	vec3 halfDirection = normalize( directIllumination.lightDirection + surface.viewDirection );

	float dotNL = saturate( dot( surface.normal, directIllumination.lightDirection ) );
	float dotNV = saturate( dot( surface.normal, surface.viewDirection ) );
	float dotNH = saturate( dot( surface.normal, halfDirection ) );
	float dotLH = saturate( dot( directIllumination.lightDirection, halfDirection ) );

	vec3 F = F_Schlick( specularColor, dotLH );
	float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );

	return directIllumination.color * dotNL * F * ( G * D );

} // validated

/*
// Analytical approximation of the DFG LUT, one half of the
// split-sum approximation used in indirect specular lighting.
// via 'environmentBRDF' from "Physically Based Shading on Mobile"
// https://www.unrealengine.com/blog/physically-based-shading-on-mobile - environmentBRDF for GGX on mobile
vec2 integrateSpecularBRDF( const in float dotNV, const in float roughness ) {
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	return vec2( -1.04, 1.04 ) * a004 + r.zw;
}

// ref: https://www.unrealengine.com/blog/physically-based-shading-on-mobile - environmentBRDF for GGX on mobile
vec3 BRDF_Specular_GGX_Environment( const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 brdf = integrateSpecularBRDF( dotNV, roughness );
	return specularColor * brdf.x + brdf.y;
} // validated

// Fdez-Agüera's "Multiple-Scattering Microfacet Model for Real-Time Image Based Lighting"
// Approximates multiscattering in order to preserve energy.
// http://www.jcgt.org/published/0008/01/03/
void BRDF_Specular_GGX_Multiscattering_Environment( const in Surface surface, const in vec3 specularColor, const in float specularRoughness, inout vec3 singleScatter, inout vec3 multiScatter ) {

	float dotNV = saturate( dot( surface.normal, surface.viewDirection ) );
	vec3 F = F_Schlick_RoughnessDependent( specularColor, dotNV, specularRoughness );
	vec2 brdf = integrateSpecularBRDF( dotNV, roughness );
	vec3 FssEss = F * brdf.x + brdf.y;

	float Ess = brdf.x + brdf.y;
	float Ems = 1.0 - Ess;

	vec3 Favg = specularColor + ( 1.0 - specularColor ) * 0.047619; // 1/21
	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );

	singleScatter += FssEss;
	multiScatter += Fms * Ems;

}
*/
