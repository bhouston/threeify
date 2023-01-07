vec3 displacePosition(
  vec3 surfacePosition,
  vec3 surfaceNormal,
  float displacementAmount
) {
  return surfacePosition + surfaceNormal * displacementAmount;
}

