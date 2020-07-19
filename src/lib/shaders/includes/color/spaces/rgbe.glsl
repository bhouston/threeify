#pragma once
#pragma include <math/math>

vec3 rgbeToLinear( in vec4 value ) {
	return vec3( value.rgb * exp2( value.a * 255. - 128. ) );
}

vec4 linearToRGBE( in vec3 value ) {
	float maxComponent = max( max( value.r, value.g ), value.b );
	float fExp = clamp( ceil( log2( maxComponent ) ), -128., 127. );
	return vec4( value.rgb / exp2( fExp ), ( fExp + 128. ) / 255. );
}
