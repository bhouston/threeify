#pragma once

vec2 unitIntervalToVec2( float value ) {
	vec2 r = vec2( value, fract( value * 255.0 ) );
	return vec2( r.x - r.y / 255.0, r.y );
}

float vec2ToUnitInterval( vec2 bytes ) {
	return bytes.x + ( bytes.y / 255.0 );
}

const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)
const float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)

const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );

const float ShiftRight8 = 1. / 256.;

vec4 unitIntervalToVec4( const in float value ) {
	vec4 r = vec4( fract( value * PackFactors ), value );
	r.yzw -= r.xyz * ShiftRight8; // tidy overflow
	return r * PackUpscale;
}

float vec4ToUnitInterval( const in vec4 bytes ) {
	return dot( bytes, UnpackFactors );
}
