#pragma once
#pragma include <math/math>

// Microfacet Models for Refraction through Rough Surfaces - equation (34)
// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html
// alpha is "roughness squared" in Disney’s reparameterization
float V_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {

	// geometry term (normalized) = G(l)⋅G(v) / 4(n⋅l)(n⋅v)
	// also see #12151

	float a2 = pow2( alpha );
	float gl = dotNL + sqrt( a2 + ( 1. - a2 ) * pow2( dotNL ) );
	float gv = dotNV + sqrt( a2 + ( 1. - a2 ) * pow2( dotNV ) );

	return 1. / ( gl * gv );

} // validated
