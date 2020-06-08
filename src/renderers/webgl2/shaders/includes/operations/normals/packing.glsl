#pragma once

vec3 normalToRgb( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}

vec3 rgbToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}