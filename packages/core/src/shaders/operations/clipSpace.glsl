#pragma once

// NOTE: viewZ/eyeZ is < 0 when in front of the camera per OpenGL conventions

float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
	return linearClipZ * ( near - far ) - near;
}

// NOTE: https://twitter.com/gonnavis/status/1377183786949959682

float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * invClipZ - far );
}

vec3 viewZToClipW( const in mat4 viewToClip, const in float viewZ ) {
	return viewToClip[2][3] * viewZ + viewToClip[3][3];
}
		
vec4 screenPositionToClipPosition( const in vec2 fragCoord, const in float clipW ) {
  return vec4(fragCoord.xy * 2.0 - 1.0, 2.0 * fragCoord.z - 1.0, fragCoord.w);
}

vec4 clipPositionToViewPosition( const in mat4 clipToView, const in vec4 clipPosition ) {
  vec4 viewPosition = clipToView * clipPosition;
  viewPosition.xyz /= viewPosition.w;
  return viewPosition;
}