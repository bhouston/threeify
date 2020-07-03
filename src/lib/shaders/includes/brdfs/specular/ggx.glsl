#pragma once
#pragma include <math/math>
#pragma include "f_schlick"
#pragma include "g_ggx_smithcorrelated"
#pragma include "d_ggx"

// GGX Distribution, Schlick Fresnel, GGX-Smith Visibility
vec3 BRDF_Specular_GGX( const in Surface surface, vec3 lightDirection, const in vec3 F0, const in float specularRoughness ) {
	float alpha = pow2( specularRoughness ); // UE4's roughness

	vec3 halfDirection = normalize( lightDirection + surface.viewDirection );

	float dotNL = saturate( dot( surface.normal, lightDirection ) );
	float dotNV = saturate( dot( surface.normal, surface.viewDirection ) );
	float dotNH = saturate( dot( surface.normal, halfDirection ) );
	float dotLH = saturate( dot( lightDirection, halfDirection ) );

	vec3 F = F_Schlick( F0, dotLH );
	float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );

  return F * ( G * D );

} // validated
