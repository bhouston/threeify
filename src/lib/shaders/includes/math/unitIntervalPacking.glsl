#pragma once


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

vec3 unitIntervalToVec3( const in float value ) {
	vec3 r = vec3( fract( value * PackFactors.yz ), value );
	r.yz -= r.xy * ShiftRight8; // tidy overflow
	return r * PackUpscale;
}

float vec3ToUnitInterval( const in vec3 bytes ) {
	return dot( bytes, UnpackFactors.yzw );
}

vec2 unitIntervalToVec2( const in float value ) {
	vec2 r = vec2( fract( value * PackFactors.z ), value );
	r.y -= r.x * ShiftRight8; // tidy overflow
	return r * PackUpscale;
}

float vec2ToUnitInterval( const in vec2 bytes ) {
	return dot( bytes, UnpackFactors.zw );
}
