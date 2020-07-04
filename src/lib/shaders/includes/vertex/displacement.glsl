vec3 standardDisplacement( in vec3 surfacePosition, in vec3 surfaceNormal, in float displacementAmount ) {
  return surfacePosition + surfaceNormal * displacementAmount;
}

