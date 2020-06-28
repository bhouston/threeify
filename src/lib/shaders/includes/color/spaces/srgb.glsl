#pragma once
#pragma include <math/math>

vec3 sRGBToLinear( in vec3 value ) {
	return vec3( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ) );
}

vec3 linearTosRGB( in vec3 value ) {
	return vec3( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ) );
}
