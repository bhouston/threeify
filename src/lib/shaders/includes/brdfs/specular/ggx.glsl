#pragma once
#pragma include <math/math>
#pragma include "f_schlick"
#pragma include "g_ggx_smithcorrelated"
#pragma include "d_ggx"

// GGX Distribution, Schlick Fresnel, GGX-Smith Visibility
vec3 BRDF_Specular_GGX( const in DirectIllumination directIllumination, const in Surface surface, const in vec3 F0, const in float specularRoughness ) {
	float alpha = pow2( specularRoughness ); // UE4's roughness

	vec3 halfDirection = normalize( directIllumination.lightDirection + surface.viewDirection );

	float dotNL = saturate( dot( surface.normal, directIllumination.lightDirection ) );
	float dotNV = saturate( dot( surface.normal, surface.viewDirection ) );
	float dotNH = saturate( dot( surface.normal, halfDirection ) );
	float dotLH = saturate( dot( directIllumination.lightDirection, halfDirection ) );

	vec3 F = F_Schlick( F0, dotLH );
	float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );

  return directIllumination.color * dotNL * F * ( G * D );

} // validated
