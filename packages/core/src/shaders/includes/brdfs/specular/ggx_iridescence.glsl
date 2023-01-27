#pragma once

#include <brdfs/specular/f_schlick>
#include <brdfs/specular/v_ggx_smithcorrelated>
#include <brdfs/specular/d_ggx>

// from Three.js - need to research this.
vec3 BRDF_GGX_Iridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 lightDir, const in vec3 f0, const in float f90, const in float iridescence, const in vec3 iridescenceFresnel, const in float roughness ) {

    float alpha = pow2( roughness ); // UE4's roughness

    vec3 halfDir = normalize( lightDir + viewDir );

    float dotNL = saturate( dot( normal, lightDir ) );
    float dotNV = saturate( dot( normal, viewDir ) );
    float dotNH = saturate( dot( normal, halfDir ) );
    float dotVH = saturate( dot( viewDir, halfDir ) );

    vec3 F = mix( F_Schlick( f0, f90, dotVH ), iridescenceFresnel, iridescence );

    float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );

    float D = D_GGX( alpha, dotNH );

    return F * ( V * D );

}