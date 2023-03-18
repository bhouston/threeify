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

// unsure if this is correct
vec4 screenPositionToClipPosition(const vec4 fragCoord) {
  return vec4(fragCoord.xyz * 2.0 - 1.0, fragCoord.w);
}

// probably correct
vec3 clipPositionToViewPosition(
  const mat4 clipToView,
  const vec4 clipPosition
) {
  vec4 viewPosition = clipToView * clipPosition;
  viewPosition.xyz /= viewPosition.w;
  return viewPosition.xyz;
}


vec3 screenPositionToViewPosition(const mat4 clipToView, const vec4 fragCoord) {
    vec4 clipSpacePosition = screenPositionToClipPosition( fragCoord );
    return clipPositionToViewPosition( clipToView, clipSpacePosition );
}