#pragma once
#pragma include <math>

// this is taken from three.js

// Analytical approximation of the DFG LUT, one half of the
// split-sum approximation used in indirect specular lighting.
// via 'environmentBRDF' from "Physically Based Shading on Mobile"
// https://www.unrealengine.com/blog/physically-based-shading-on-mobile
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float specularRoughness ) {

    float dotNV = saturate( dot( normal, viewDir ) );

    const vec4 c0 = vec4( -1, -0.0275, -0.572, 0.022 );
    const vec4 c1 = vec4( 1, 0.0425, 1.04, -0.04 );

    vec4 r = roughness * c0 + c1;

    float a004 = min( r.x * r.x, exp2( -9.28 * dotNV ) ) * r.x + r.y;
    vec2 fab = vec2( -1.04, 1.04 ) * a004 + r.zw;

    return fab;
}

// Fdez-Agüera's "Multiple-Scattering Microfacet Model for Real-Time Image Based Lighting"
// Approximates multiscattering in order to preserve energy.
// http://www.jcgt.org/published/0008/01/03/
void BRDF_Specular_GGX_Multiscatter( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float specularRoughness, out vec3 singleScatter, out vec3 multiScatter ) {
    vec2 fab = DFGApprox( normal, viewDir, specularRoughness );

    vec3 Fr = specularColor;

    vec3 FssEss = Fr * fab.x + specularF90 * fab.y;

    float Ess = fab.x + fab.y;
    float Ems = 1.0 - Ess;

    vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619; // 1/21
    vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );

    singleScatter = FssEss;
    multiScatter = Fms * Ems;
}