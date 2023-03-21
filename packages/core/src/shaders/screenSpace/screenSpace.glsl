#pragma once

// NOTE: viewZ/eyeZ is < 0 when in front of the camera per OpenGL conventions

float viewZToOrthographicDepth(
  const float viewZ,
  const float near,
  const float far
) {
  return (viewZ + near) / (near - far);
}
float orthographicDepthToViewZ(
  const float linearClipZ,
  const float near,
  const float far
) {
  return linearClipZ * (near - far) - near;
}

// NOTE: https://twitter.com/gonnavis/status/1377183786949959682

float viewZToPerspectiveDepth(
  const float viewZ,
  const float near,
  const float far
) {
  return (near + viewZ) * far / ((far - near) * viewZ);
}
float perspectiveDepthToViewZ(
  const float invClipZ,
  const float near,
  const float far
) {
  return near * far / ((far - near) * invClipZ - far);
}

float viewZToClipW(const mat4 viewToClip, const float viewZ) {
  return viewToClip[2][3] * viewZ + viewToClip[3][3];
}

// function that extracts near and far from a standard perspective matrix
// TODO: This has not been error checked at all.
void viewToClipToNearFar(const mat4 viewToClip, out float near, out float far) {
  near = viewToClip[2][3] / (viewToClip[2][2] - 1.0);
  far = viewToClip[2][3] / (viewToClip[2][2] + 1.0);
}

// function that extracts near and far from an inverse perspective matrix
// TODO: This has not been error checked at all.
void clipToViewToNearFar(const mat4 clipToView, out float near, out float far) {
  near = clipToView[2][3] / (clipToView[2][2] + 1.0);
  far = clipToView[2][3] / (clipToView[2][2] - 1.0);
}

// probably correct
vec3 clipPositionToViewPosition(
  const mat4 clipToView,
  const vec4 clipPosition
) {
  vec4 viewPosition = clipToView * clipPosition;
  return viewPosition.xyz;
}

/*
vec3 screenPositionToViewPosition(const mat4 clipToView, const vec4 fragCoord) {
    vec4 clipSpacePosition = screenPositionToClipPosition( fragCoord );
    return clipPositionToViewPosition( clipToView, clipSpacePosition );
}*/

vec2 fragCoordToUVSpace(const vec2 fragCoord, const vec2 screenSize) {
  return fragCoord / screenSize;
}
