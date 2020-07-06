#pragma once
#pragma include <math/math>
#pragma include "f_schlick"
#pragma include "v_ggx_smithcorrelated"
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
	float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );

  return F * ( V * D );

} // validated

/*
//  https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#acknowledgments AppendixB
vec3 BRDF_specularGGX_2(vec3 f0, vec3 f90, float alphaRoughness, float VdotH, float NdotL, float NdotV, float NdotH)
{
    vec3 F = F_Schlick(f0, f90, VdotH);
    float Vis = V_GGX(NdotL, NdotV, alphaRoughness);
    float D = D_GGX(NdotH, alphaRoughness);

    return F * Vis * D;
}
*/
